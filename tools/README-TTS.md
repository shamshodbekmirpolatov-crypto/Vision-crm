# Vision TTS Agent

This Windows helper connects the Teacher Reading Library to the local Kokoro installation.

## What it does

1. Polls the secure `tts-worker` Edge Function for pending Reading audio jobs.
2. Uses the local `kokoro-v1.0.onnx` and `voices-v1.0.bin` files in the Windows Downloads folder.
3. Generates the assigned American or British audio.
4. Uploads the finished audio to the `reading-audio` Supabase Storage bucket.
5. Marks the Reading article audio as ready so the Student Dashboard can play it.

## Run

Double-click `start_vision_tts_agent.bat`.

On the first run, sign in with an authorized Vision CRM account. The password is not stored. A Supabase refresh token is stored under `%APPDATA%\\VisionTTS\\session.json` so later launches can sign in automatically.

The agent requires the same Python environment where `kokoro-onnx`, NumPy and SoundFile are installed.
