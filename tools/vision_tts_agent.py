import getpass
import json
import os
import re
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
TTS_WORKER_URL = SUPABASE_URL + "/functions/v1/tts-worker"
ENRICH_WORKER_URL = SUPABASE_URL + "/functions/v1/reading-enrichment-worker"
BUCKET = "reading-audio"
POLL_SECONDS = 8

OLLAMA_URL = os.environ.get("VISION_OLLAMA_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.environ.get("VISION_OLLAMA_MODEL", "qwen2.5:7b")

APP_DIR = Path(os.environ.get("APPDATA") or Path.home()) / "VisionTTS"
SESSION_FILE = APP_DIR / "session.json"
DOWNLOADS = Path.home() / "Downloads"
MODEL_FILE = DOWNLOADS / "kokoro-v1.0.onnx"
VOICES_FILE = DOWNLOADS / "voices-v1.0.bin"


class VisionSession:
    def __init__(self):
        self.access_token = ""
        self.refresh_token = ""

    def _request_json(self, url, body, headers=None, timeout=60):
        payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(url, data=payload, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("apikey", SUPABASE_KEY)
        for key, value in (headers or {}).items():
            req.add_header(key, value)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
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

    def worker_call(self, worker_url, action, **extra):
        body = {"action": action, **extra}
        for attempt in range(2):
            try:
                return self._request_json(
                    worker_url,
                    body,
                    {"Authorization": "Bearer " + self.access_token},
                    timeout=60,
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


def http_json(url, body, timeout=300):
    payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(url, data=payload, method="POST")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def ollama_is_ready():
    try:
        req = urllib.request.Request(OLLAMA_URL + "/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode("utf-8"))
        names = {str(item.get("name", "")) for item in data.get("models", [])}
        return True, names
    except Exception:
        return False, set()


def split_paragraph_sentences(text):
    raw = str(text or "").strip()
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", raw) if p.strip()]
    if not paragraphs and raw:
        paragraphs = [raw]

    result = []
    counter = 1
    for paragraph in paragraphs:
        sentence_texts = [s.strip() for s in re.split(r"(?<=[.!?])\s+", paragraph) if s.strip()]
        if not sentence_texts:
            sentence_texts = [paragraph]
        row = []
        for sentence in sentence_texts:
            row.append({"id": f"S{counter}", "text": sentence})
            counter += 1
        result.append(row)
    return result


def article_sentence_index(paragraphs):
    return [item for paragraph in paragraphs for item in paragraph]


def extract_json_object(text):
    text = str(text or "").strip()
    try:
        return json.loads(text)
    except Exception:
        start = text.find("{")
        end = text.rfind("}")
        if start >= 0 and end > start:
            return json.loads(text[start:end + 1])
        raise


def slug_key(term, used):
    base = re.sub(r"[^a-z0-9]+", "_", term.lower()).strip("_") or "item"
    key = base
    suffix = 2
    while key in used:
        key = f"{base}_{suffix}"
        suffix += 1
    used.add(key)
    return key


def exact_article_term(article_text, proposed):
    proposed = str(proposed or "").strip()
    if not proposed:
        return None
    match = re.search(re.escape(proposed), article_text, flags=re.IGNORECASE)
    if not match:
        return None
    return article_text[match.start():match.end()]


def normalise_examples(raw):
    out = []
    if not isinstance(raw, list):
        return out
    for item in raw[:2]:
        if isinstance(item, list) and len(item) >= 2:
            en, uz = str(item[0]).strip(), str(item[1]).strip()
        elif isinstance(item, dict):
            en, uz = str(item.get("en", "")).strip(), str(item.get("uz", "")).strip()
        else:
            continue
        if en and uz:
            out.append([en, uz])
    return out


def build_enrichment_prompt(job, sentence_rows):
    flat = article_sentence_index(sentence_rows)
    sentences = "\n".join(f"{item['id']}: {item['text']}" for item in flat)
    allowed = ", ".join(job.get("allowed_levels") or []) or "not specified"
    level_label = job.get("level_label") or "not specified"

    return f"""
You are preparing one English-reading lesson for Vision Learning Centre in Uzbekistan.

COURSE ACCESS: {allowed}
ARTICLE LEVEL LABEL: {level_label}

Your output is used directly by students. Produce natural, idiomatic Uzbek, not literal machine-style Uzbek.

NON-NEGOTIABLE RULES:
1. Return one valid JSON object only. No markdown, no commentary.
2. Do not rewrite, simplify, correct, or paraphrase any English sentence from the source.
3. Translate EVERY sentence ID into natural Uzbek.
4. Select practical vocabulary ONLY from exact words, phrases, or collocations that already appear in the article.
5. Prefer useful phrases/collocations over isolated easy words when appropriate.
6. Choose approximately 10-18 vocabulary items for a normal article; fewer only if the text is very short.
7. Do not choose names, dates, numbers, obvious beginner function words, or useless technical fragments.
8. For each vocabulary item:
   - "term" must be an exact visible substring from the article.
   - "uz" must be a concise, natural Uzbek equivalent for that meaning in context.
   - "level" should be A2, B1, or B2–C1.
   - give exactly two simple, natural English examples plus natural Uzbek translations.
   - give zero, one, or at most two genuinely interchangeable/common synonyms. If none is truly interchangeable, use [].
9. Exercises must practise ONLY vocabulary items selected above. Do not introduce new target phrases.
10. Create 6 useful multiple-choice vocabulary questions when possible. Each must have exactly 3 options and a 0-based "answer" integer.
11. Keep the Uzbek meaning consistent across the main gloss and the examples unless the English meaning genuinely changes.

JSON SHAPE:
{{
  "translations": {{
    "S1": "Uzbek translation",
    "S2": "Uzbek translation"
  }},
  "vocabulary": [
    {{
      "term": "exact phrase from article",
      "level": "B1",
      "uz": "natural Uzbek meaning",
      "examples": [
        ["English example 1.", "Uzbek translation 1."],
        ["English example 2.", "Uzbek translation 2."]
      ],
      "synonyms": ["synonym 1", "synonym 2"]
    }}
  ],
  "exercises": [
    {{
      "prompt": "Question using one selected vocabulary item",
      "options": ["option A", "option B", "option C"],
      "answer": 0
    }}
  ]
}}

SOURCE SENTENCES:
{sentences}
""".strip()


def call_ollama_for_enrichment(job, sentence_rows):
    prompt = build_enrichment_prompt(job, sentence_rows)
    response = http_json(
        OLLAMA_URL + "/api/chat",
        {
            "model": OLLAMA_MODEL,
            "stream": False,
            "format": "json",
            "options": {"temperature": 0.15},
            "messages": [
                {
                    "role": "system",
                    "content": "You create precise English-learning data and natural English-to-Uzbek translations. Output strict JSON only.",
                },
                {"role": "user", "content": prompt},
            ],
        },
        timeout=600,
    )
    content = response.get("message", {}).get("content", "")
    return extract_json_object(content)


def build_rich_article(job, model_data, sentence_rows):
    article_text = str(job.get("text") or "")
    translations = model_data.get("translations") if isinstance(model_data, dict) else {}
    if not isinstance(translations, dict):
        translations = {}

    content_paragraphs = []
    for paragraph in sentence_rows:
        rendered = []
        for item in paragraph:
            uz = str(translations.get(item["id"], "")).strip()
            if not uz:
                raise RuntimeError(f"Missing Uzbek translation for {item['id']}.")
            rendered.append({"text": item["text"], "uz": uz})
        content_paragraphs.append(rendered)

    vocab_json = {}
    used_keys = set()
    vocab_items = model_data.get("vocabulary", []) if isinstance(model_data, dict) else []
    if not isinstance(vocab_items, list):
        vocab_items = []

    seen_terms = set()
    for raw in vocab_items:
        if not isinstance(raw, dict):
            continue
        term = exact_article_term(article_text, raw.get("term"))
        if not term:
            continue
        norm = term.lower()
        if norm in seen_terms:
            continue
        examples = normalise_examples(raw.get("examples"))
        if len(examples) < 2:
            continue
        seen_terms.add(norm)
        synonyms = [str(x).strip() for x in (raw.get("synonyms") or []) if str(x).strip()][:2]
        key = slug_key(term, used_keys)
        vocab_json[key] = {
            "term": term,
            "level": str(raw.get("level") or "B1").strip(),
            "uz": str(raw.get("uz") or "").strip(),
            "examples": examples,
            "synonyms": synonyms,
            "audio": {},
        }

    if not vocab_json:
        raise RuntimeError("The local language model did not return any valid vocabulary from the article.")

    exercises = []
    raw_exercises = model_data.get("exercises", []) if isinstance(model_data, dict) else []
    valid_terms = [item["term"].lower() for item in vocab_json.values()]
    for raw in raw_exercises if isinstance(raw_exercises, list) else []:
        if not isinstance(raw, dict):
            continue
        prompt = str(raw.get("prompt") or "").strip()
        options = [str(x).strip() for x in (raw.get("options") or [])]
        try:
            answer = int(raw.get("answer"))
        except Exception:
            continue
        if not prompt or len(options) != 3 or answer not in (0, 1, 2):
            continue
        if not any(term in prompt.lower() for term in valid_terms):
            # Keep the exercise only when it clearly practises one of the selected items.
            continue
        exercises.append({"prompt": prompt, "options": options, "answer": answer})
        if len(exercises) >= 6:
            break

    return {
        "content_json": {"sections": [{"heading": "", "paragraphs": content_paragraphs}]},
        "vocab_json": vocab_json,
        "exercise_questions": exercises,
    }


def process_enrichment_job(session, job):
    ready, models = ollama_is_ready()
    if not ready:
        raise RuntimeError("Ollama is not running. Start Ollama on this computer first.")
    if models and not any(name == OLLAMA_MODEL or name.startswith(OLLAMA_MODEL + ":") for name in models):
        # Ollama accepts model aliases, so only warn instead of stopping.
        print(f"Warning: {OLLAMA_MODEL} was not listed by Ollama. I will still try it.")

    sentence_rows = split_paragraph_sentences(job.get("text", ""))
    if not sentence_rows:
        raise RuntimeError("The reading text is empty.")

    print("Preparing translations, bold vocabulary cards, examples, synonyms and exercises...")
    last_error = None
    for attempt in range(2):
        try:
            model_data = call_ollama_for_enrichment(job, sentence_rows)
            package = build_rich_article(job, model_data, sentence_rows)
            session.worker_call(
                ENRICH_WORKER_URL,
                "complete",
                job_id=job["id"],
                content_json=package["content_json"],
                vocab_json=package["vocab_json"],
                exercise_questions=package["exercise_questions"],
            )
            print(f"Rich Reading package ready: {len(package['vocab_json'])} vocabulary items, {len(package['exercise_questions'])} exercises.")
            return
        except Exception as exc:
            last_error = exc
            print(f"Enrichment attempt {attempt + 1} failed:", exc)
    raise RuntimeError(str(last_error or "Reading enrichment failed."))


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

        pieces = [sentence]
        if len(sentence) > max_chars:
            pieces = []
            words = sentence.split()
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


def generate_audio(kokoro, job):
    text = job.get("text", "")
    chunks = split_text(text)
    if not chunks:
        raise RuntimeError("The TTS text is empty.")

    accent = job.get("accent", "us")
    lang = "en-gb" if accent == "gb" else "en-us"
    voice = job["voice"]
    speed = float(job.get("speed") or 0.95)

    audio_parts = []
    sample_rate = None

    label = "vocabulary" if job.get("job_type") == "vocab_audio" else "article"
    print(f"Generating {accent.upper()} {label} audio with {voice} at {speed}x...")
    for index, chunk in enumerate(chunks, start=1):
        if len(chunks) > 1:
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

    suffix = job.get("vocab_key") or "article"
    safe_suffix = re.sub(r"[^a-zA-Z0-9_-]+", "_", str(suffix))[:80]
    base_name = f"{job['article_id']}-{safe_suffix}-{accent}"

    mp3_path = temp_dir / f"{base_name}.mp3"
    try:
        sf.write(str(mp3_path), combined, sample_rate, format="MP3")
        return mp3_path, "audio/mpeg"
    except Exception as mp3_error:
        print("MP3 encoding was unavailable; using WAV for this file:", mp3_error)
        wav_path = temp_dir / f"{base_name}.wav"
        sf.write(str(wav_path), combined, sample_rate, format="WAV")
        return wav_path, "audio/wav"


def process_tts_job(session, kokoro, job):
    audio_path, content_type = generate_audio(kokoro, job)
    extension = audio_path.suffix.lower()

    if job.get("job_type") == "vocab_audio":
        vocab_key = re.sub(r"[^a-zA-Z0-9_-]+", "_", str(job.get("vocab_key") or "item"))[:80]
        object_path = f"articles/{job['article_id']}/vocab/{vocab_key}-{job['accent']}{extension}"
    else:
        object_path = f"articles/{job['article_id']}/{job['accent']}{extension}"

    print("Uploading", audio_path.name, "...")
    session.upload_audio(object_path, audio_path, content_type)
    result = session.worker_call(TTS_WORKER_URL, "complete", job_id=job["id"], object_path=object_path)
    if result.get("ready"):
        print("Uploaded successfully. The complete Reading item is ready for students.")
    else:
        print("Uploaded successfully.")


def main():
    print("=" * 66)
    print("VISION READING AGENT — rich content + Kokoro audio")
    print("=" * 66)

    if not MODEL_FILE.exists():
        raise SystemExit(f"Kokoro model not found: {MODEL_FILE}")
    if not VOICES_FILE.exists():
        raise SystemExit(f"Kokoro voices file not found: {VOICES_FILE}")

    session = VisionSession()
    session.load_or_login()

    ollama_ready, models = ollama_is_ready()
    if ollama_ready:
        print(f"Local Reading AI detected. Model: {OLLAMA_MODEL}")
        if models:
            print("Ollama models:", ", ".join(sorted(models)))
    else:
        print("Local Reading AI is not running yet. Teacher texts can queue, but rich Reading features will wait until Ollama is installed and running.")

    print("\nLoading Kokoro model...")
    kokoro = Kokoro(str(MODEL_FILE), str(VOICES_FILE))
    print("Kokoro is ready.")
    print("Leave this window open. New teacher Reading texts will be prepared automatically.\n")

    last_ollama_warning = 0.0

    while True:
        try:
            enrich_response = session.worker_call(ENRICH_WORKER_URL, "next_job")
            enrich_job = enrich_response.get("job")

            if enrich_job:
                print("-" * 66)
                print("Reading:", enrich_job.get("title", "Reading text"))
                print("Stage: full Reading enrichment")
                try:
                    process_enrichment_job(session, enrich_job)
                except Exception as job_error:
                    print("Enrichment paused:", job_error)
                    now = time.time()
                    # Do not mark the job permanently failed just because Ollama is not running.
                    if "Ollama is not running" in str(job_error):
                        # Return it to pending by reporting failure only after Ollama exists but generation itself fails.
                        # The worker claim will otherwise stay processing, so mark an actionable error.
                        session.worker_call(ENRICH_WORKER_URL, "fail", job_id=enrich_job["id"], error=str(job_error))
                    else:
                        session.worker_call(ENRICH_WORKER_URL, "fail", job_id=enrich_job["id"], error=str(job_error))
                    if now - last_ollama_warning > 30:
                        print("Start Ollama and make sure the configured model is available, then requeue the text from the Teacher Reading Library.")
                        last_ollama_warning = now
                    time.sleep(10)
                continue

            tts_response = session.worker_call(TTS_WORKER_URL, "next_job")
            tts_job = tts_response.get("job")
            if tts_job:
                print("-" * 66)
                print("Reading:", tts_job.get("title", "Reading text"))
                print("Stage:", tts_job.get("job_type"), "|", tts_job["accent"].upper())
                try:
                    process_tts_job(session, kokoro, tts_job)
                except Exception as job_error:
                    print("TTS job failed:", job_error)
                    try:
                        session.worker_call(TTS_WORKER_URL, "fail", job_id=tts_job["id"], error=str(job_error))
                    except Exception as report_error:
                        print("Could not report the TTS failure:", report_error)
                continue

            time.sleep(POLL_SECONDS)

        except KeyboardInterrupt:
            print("\nVision Reading Agent stopped.")
            break
        except Exception as exc:
            print("Worker error:", exc)
            print("Retrying in 15 seconds...")
            time.sleep(15)


if __name__ == "__main__":
    main()
