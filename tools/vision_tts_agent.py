import getpass
import json
import os
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SUPABASE_URL = "https://ctdzmoaftajdkvreyqox.supabase.co"
SUPABASE_KEY = "sb_publishable_DW6EY5_aJ6TShRxhq3x28g_TGJ-kEBJ"
WORKER_URL = SUPABASE_URL + "/functions/v1/tts-worker"
BUCKET = "reading-audio"
POLL_SECONDS = 10

APP_DIR = Path(os.environ.get("APPDATA") or Path.home()) / "VisionTTS"
SESSION_FILE = APP_DIR / "session.json"
DOWNLOADS = Path.home() / "Downloads"
MODEL_FILE = DOWNLOADS / "kokoro-v1.0.onnx"
VOICES_FILE = DOWNLOADS / "voices-v1.0.bin"


class VisionSession:
    def __init__(self):
        self.access_token = ""
        self.refresh_token = ""

    def _request_json(self, url, body, headers=None):
        payload = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(url, data=payload, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("apikey", SUPABASE_KEY)
        for key, value in (headers or {}).items():
            req.add_header(key, value)
        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            message = exc.read().decode("utf-8", errors="replace")
            try:
                detail = json.loads(message)
                message = detail.get("error_description") or detail.get("msg") or detail.get("error") or message
            except Exception:
                pass
            raise RuntimeError(f"HTTP {exc.code}: {message}") from exc

    def save(self):
        APP_DIR.mkdir(parents=True, exist_ok=True)
        SESSION_FILE.write_text(json.dumps({"refresh_token": self.refresh_token}), encoding="utf-8")

    def sign_in(self, email, password):
        data = self._request_json(
            SUPABASE_URL + "/auth/v1/token?grant_type=password",
            {"email": email, "password": password},
        )
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]
        self.save()

    def refresh(self):
        if not self.refresh_token:
            raise RuntimeError("No saved session.")
        data = self._request_json(
            SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token",
            {"refresh_token": self.refresh_token},
        )
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]
        self.save()

    def load_or_login(self):
        if SESSION_FILE.exists():
            try:
                saved = json.loads(SESSION_FILE.read_text(encoding="utf-8"))
                self.refresh_token = saved.get("refresh_token", "")
                if self.refresh_token:
                    self.refresh()
                    print("Signed in using the saved Vision CRM session.")
                    return
            except Exception as exc:
                print("Saved session could not be refreshed:", exc)

        print("\nSign in with a Vision CRM Owner, Senior Manager, Administrator, or Teacher account.")
        email = input("Email: ").strip()
        password = getpass.getpass("Password: ")
        self.sign_in(email, password)
        print("Signed in successfully.")

    def worker_call(self, action, **extra):
        body = {"action": action, **extra}
        for attempt in range(2):
            try:
                return self._request_json(
                    WORKER_URL,
                    body,
                    {"Authorization": "Bearer " + self.access_token},
                )
            except RuntimeError as exc:
                if attempt == 0 and ("401" in str(exc) or "Invalid session" in str(exc)):
                    self.refresh()
                    continue
                raise

    def upload_audio(self, object_path, file_path, content_type):
        quoted = "/".join(urllib.parse.quote(part, safe="") for part in object_path.split("/"))
        url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{quoted}"
        data = Path(file_path).read_bytes()

        for attempt in range(2):
            req = urllib.request.Request(url, data=data, method="POST")
            req.add_header("apikey", SUPABASE_KEY)
            req.add_header("Authorization", "Bearer " + self.access_token)
            req.add_header("Content-Type", content_type)
            req.add_header("x-upsert", "true")
            try:
                with urllib.request.urlopen(req, timeout=120) as response:
                    response.read()
                    return
            except urllib.error.HTTPError as exc:
                message = exc.read().decode("utf-8", errors="replace")
                if attempt == 0 and exc.code == 401:
                    self.refresh()
                    continue
                raise RuntimeError(f"Audio upload failed ({exc.code}): {message}") from exc


def split_text(text, max_chars=750):
    clean = re.sub(r"\s+", " ", str(text or "")).strip()
    if not clean:
        return []

    sentences = re.split(r"(?<=[.!?])\s+", clean)
    chunks = []
    current = ""

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        if len(sentence) > max_chars:
            words = sentence.split()
            pieces = []
            piece = ""
            for word in words:
                candidate = (piece + " " + word).strip()
                if piece and len(candidate) > max_chars:
                    pieces.append(piece)
                    piece = word
                else:
                    piece = candidate
            if piece:
                pieces.append(piece)
        else:
            pieces = [sentence]

        for piece in pieces:
            candidate = (current + " " + piece).strip()
            if current and len(candidate) > max_chars:
                chunks.append(current)
                current = piece
            else:
                current = candidate

    if current:
        chunks.append(current)
    return chunks


def generate_article_audio(kokoro, job):
    text = job.get("text", "")
    chunks = split_text(text)
    if not chunks:
        raise RuntimeError("The reading text is empty.")

    accent = job.get("accent", "us")
    lang = "en-gb" if accent == "gb" else "en-us"
    voice = job["voice"]
    speed = float(job.get("speed") or 0.95)

    audio_parts = []
    sample_rate = None

    print(f"Generating {accent.upper()} audio with {voice} at {speed}x...")
    for index, chunk in enumerate(chunks, start=1):
        print(f"  chunk {index}/{len(chunks)}")
        audio, sr = kokoro.create(chunk, voice=voice, speed=speed, lang=lang)
        if sample_rate is None:
            sample_rate = sr
        elif sample_rate != sr:
            raise RuntimeError("Kokoro returned inconsistent sample rates.")
        audio_parts.append(np.asarray(audio, dtype=np.float32))
        if index < len(chunks):
            audio_parts.append(np.zeros(int(sr * 0.24), dtype=np.float32))

    combined = np.concatenate(audio_parts)
    temp_dir = Path(tempfile.gettempdir()) / "vision-tts"
    temp_dir.mkdir(parents=True, exist_ok=True)
    mp3_path = temp_dir / f"{job['article_id']}-{accent}.mp3"

    try:
        sf.write(str(mp3_path), combined, sample_rate, format="MP3")
        return mp3_path, "audio/mpeg"
    except Exception as mp3_error:
        print("MP3 encoding was unavailable; using WAV for this file:", mp3_error)
        wav_path = temp_dir / f"{job['article_id']}-{accent}.wav"
        sf.write(str(wav_path), combined, sample_rate, format="WAV")
        return wav_path, "audio/wav"


def main():
    print("=" * 58)
    print("VISION TTS AGENT — Kokoro reading audio worker")
    print("=" * 58)

    if not MODEL_FILE.exists():
        raise SystemExit(f"Model not found: {MODEL_FILE}")
    if not VOICES_FILE.exists():
        raise SystemExit(f"Voices file not found: {VOICES_FILE}")

    session = VisionSession()
    session.load_or_login()

    print("\nLoading Kokoro model...")
    kokoro = Kokoro(str(MODEL_FILE), str(VOICES_FILE))
    print("Kokoro is ready.")
    print("Leave this window open. New teacher Reading texts will be processed automatically.\n")

    while True:
        try:
            response = session.worker_call("next_job")
            job = response.get("job")
            if not job:
                time.sleep(POLL_SECONDS)
                continue

            print("-" * 58)
            print("Reading:", job.get("title", "Reading text"))
            print("Job:", job["id"], "|", job["accent"].upper())

            try:
                audio_path, content_type = generate_article_audio(kokoro, job)
                extension = audio_path.suffix.lower()
                object_path = f"articles/{job['article_id']}/{job['accent']}{extension}"
                print("Uploading", audio_path.name, "...")
                session.upload_audio(object_path, audio_path, content_type)
                result = session.worker_call("complete", job_id=job["id"], object_path=object_path)
                print("Uploaded successfully.", "Article audio ready." if result.get("ready") else "Waiting for the other accent.")
            except Exception as job_error:
                print("Job failed:", job_error)
                try:
                    session.worker_call("fail", job_id=job["id"], error=str(job_error))
                except Exception as report_error:
                    print("Could not report the failure:", report_error)

        except KeyboardInterrupt:
            print("\nVision TTS Agent stopped.")
            break
        except Exception as exc:
            print("Worker error:", exc)
            print("Retrying in 15 seconds...")
            time.sleep(15)


if __name__ == "__main__":
    main()
