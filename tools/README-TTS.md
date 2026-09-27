# Vision Reading Agent

This Windows helper connects the Teacher Reading Library to the complete student Reading experience.

## What happens after a teacher adds a text

The text is saved immediately, but it is **not shown to students until the complete package is ready**.

The agent automatically prepares:

- sentence-by-sentence natural Uzbek translations for Translation Mode;
- practical bold vocabulary selected from the article;
- natural Uzbek meanings for every selected word/phrase;
- two English examples with Uzbek translations for every vocabulary item;
- up to two genuinely interchangeable/common synonyms when useful;
- vocabulary practice questions;
- British and American Kokoro recordings for the full article;
- British and American Kokoro recordings for every bold vocabulary item.

The existing student highlighter, popups, translation mode, Reading layout, return controls and exercises then work with the new article exactly like the built-in Reading materials.

## Local software

The computer needs:

1. **Kokoro**, already configured with:
   - `%USERPROFILE%\Downloads\kokoro-v1.0.onnx`
   - `%USERPROFILE%\Downloads\voices-v1.0.bin`
2. **Ollama** for the local Reading-language processor.
3. An Ollama model. By default the agent uses:
   - `qwen3:4b-instruct`

You can choose another installed Ollama model by setting the environment variable `VISION_OLLAMA_MODEL`.

## Run

Double-click:

`start_vision_tts_agent.bat`

On the first run, sign in with an authorized Vision CRM Owner, Senior Manager, Administrator, or Teacher account. The password is not stored. A Supabase refresh token is stored under:

`%APPDATA%\VisionTTS\session.json`

## Processing order

1. Teacher adds a text.
2. A Reading enrichment job is queued.
3. The local model builds all interactive Reading data.
4. Kokoro audio jobs are created automatically.
5. Kokoro creates and uploads full-text and vocabulary audio.
6. Only when **Reading features = Ready** and **Kokoro audio = Ready** does the text become visible to the permitted student levels.
