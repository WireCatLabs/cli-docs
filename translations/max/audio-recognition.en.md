---
title: "Voice messages: speech recognition"
---

Use this page when a voice message arrives in a MAX chat and you or your AI agent would rather read it as text. You will learn to choose a speech-recognition model for the recording's language, download it once, and transcribe one voice message or all voice messages in a displayed list.

Terms used below:

- **Speech-recognition model** — a file that turns audio into text. Download it once; it then works without the internet.
- **Local transcription** — recognition runs on your computer. The recording goes neither to an external service nor to your agent's AI service, and does not use external API limits.
- **Transcript** — the resulting voice-message text. `max` saves it to avoid recognising the same recording again.

## What you can do

| Task | Command |
| --- | --- |
| See available models, sizes and downloads | `max models audio list` |
| Download a model | `max models audio download <модель>` |
| Transcribe one voice message | `max messages transcribe <чат> <сообщение>` |
| Transcribe voice messages in the displayed list | `--transcribe` with `messages list` and `inbox` |
| Choose a model for future runs | `max config set --defaults transcribeModel <модель>` |

## Quick start

```sh
max models audio list --json
max models audio download gigaam-v3
max messages transcribe "Учебная группа" 204 --json
```

`max` downloads the recording from MAX, closes the connection and then starts recognition. Reading a chat does not automatically download the model: run `models audio download` first. Downloaded files are reused and their checksums are verified during installation.

## Choose a model

| Model | Suitable for |
| --- | --- |
| `gigaam-v3` | Russian speech; the default model |
| `gigaam-v3-ctc` | Another Russian model; wording and formatting can differ |
| `parakeet-v3` | Several languages, including Spanish, English and Russian; uses more disk space and memory |

`models audio list` shows exact sizes and existing downloads. Choose a model that supports the recording's language. For one run:

```sh
max models audio download parakeet-v3
max messages transcribe "Учебная группа" 204 --model parakeet-v3 --json
```

For future runs:

```sh
max config set --defaults transcribeModel parakeet-v3
```

Keep command groups distinct: `models audio` manages speech recognition; `models text` manages search components and API keys. The image setting `models.ocr` does not affect voice transcription.

## Multiple messages

```sh
max messages list "Учебная группа" --limit 20 --transcribe --json
max inbox --transcribe --json
```

`--transcribe` processes only voice messages in the displayed list that lack text, rather than the entire chat history. It first downloads the recordings, closes the connection, then recognises speech. `--model` selects a different model for one run.

Text is saved under your account in the shared local archive. It appears in message views, inbox, review and the MCP server. If the same model has already transcribed the same message, `max` can return the saved text. JSON uses the `transcript` field. Failed recordings appear in `unheard`, with reasons printed to stderr.

## Formats and limits

This processes voice messages identified by MAX as `kind: voice`. An MP3 or WAV sent as a document is not transcribed this way, and it does not extract speech from video. Your agent needs its own tool for such files: for example, extract the audio track, convert it to a supported format and run suitable speech recognition.

Local transcription accepts a complete mono or stereo Ogg Opus recording without a separate duration limit. Longer recordings require more memory and processing time.

MAX and Telegram share the downloaded model folder; `CLI_COMMON_CACHE_DIR` changes its location. Downloads need disk space; recognition needs memory and processor time. Speed depends on recording length, model and computer.

## Quality

Language, noise, overlapping speakers, microphone quality, speech rate, names and uncommon terms affect accuracy. A larger model is not always better for a particular language. Check important numbers, names and agreements against the recording. Saved text does not prove every word was recognised correctly.

Your agent can read the transcript and help spot errors. Comparing it with the audio requires the recording itself and the agent's own listening or recognition tools; availability depends on the agent.

See [attachments](./attachments.md) for text in documents and images. [External models](./external-models.md) explains connecting an external AI service through an API.
