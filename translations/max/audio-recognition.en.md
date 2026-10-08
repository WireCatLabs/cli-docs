---
title: "Voice messages: speech recognition"
---

This guide helps you turn MAX voice messages into text: choose a model for the language, download it once, and transcribe one message or voice messages in selected results. Speech recognition runs on your computer; recordings are not sent to an external AI model.

## Quick start

```sh
max models audio list --json
max models audio download gigaam-v3
max messages transcribe "Учебная группа" 204 --json
```

The CLI retrieves the recording from MAX, closes the connection and runs the local model. Models are not downloaded automatically while reading a chat: run `models audio download` first. Downloaded files are reused and checked by checksum during installation.

## Choose a model

| Model | Suitable for |
| --- | --- |
| `gigaam-v3` | Russian speech; the default model |
| `gigaam-v3-ctc` | Another Russian model variant; transcription and formatting may differ |
| `parakeet-v3` | Multilingual speech, including Spanish, English and Russian; requires more disk space and memory |

Check `models audio list` for the exact size and installation status. Choose a model that supports the recording language. For one run:

```sh
max models audio download parakeet-v3
max messages transcribe "Учебная группа" 204 --model parakeet-v3 --json
```

For future runs:

```sh
max config set --defaults transcribeModel parakeet-v3
```

`models audio` manages speech models. `models text` manages search models and API keys; it is a different group. The `models.ocr` image setting does not change voice recognition.

## Multiple messages

```sh
max messages list "Учебная группа" --limit 20 --transcribe --json
max inbox --transcribe --json
```

`--transcribe` processes voice messages in the displayed results that do not yet have text, rather than the entire chat history. It first downloads the recordings, then closes the connection and performs recognition. Set `--model` for one run if needed.

Text is saved under your account in the shared local database. Message viewing, inbox, overview and MCP use it. Transcribing the same message with the same model again may reuse the saved result. In JSON, text appears in `transcript`; failed recordings are listed in `unheard`, and the reason also appears in stderr.

## Formats and limits

This workflow supports voice messages that MAX represents as `kind: voice`. It does not promise transcription of any MP3/WAV sent as a document or automatically extract speech from videos. For such files, the agent needs a separate available tool, such as audio-track extraction, audio conversion and a suitable speech model.

Models are stored in a shared MAX and Telegram directory; `CLI_COMMON_CACHE_DIR` changes it. Downloading requires disk space, and recognition requires memory and CPU time. Speed depends on recording length, model and computer.

## Quality

Language, noise, simultaneous speakers, microphone quality, speech rate, names and specialist terms affect the result. A larger model does not guarantee better results for a particular language. Check important numbers, names and agreements against the audio. A saved transcript does not prove every word was recognized correctly.

An agent can read the transcript and help find errors, but verification requires access to the recording and a playback or recognition tool. This depends on the agent’s tools. The CLI commands above require no external API and use none of its quota.

Documents and image OCR are covered in the [attachments guide](./attachments.md). See the [API guide](./external-models.md) to configure external models.
