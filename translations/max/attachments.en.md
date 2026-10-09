---
title: "File attachments"
---

Use this page to send a document, download an attachment or find text inside a file. You will learn which formats are read automatically, when an agent or external API is needed, and how to save recognized text so `content:` finds the original message.

Sending delivers a file to a chat, downloading saves its bytes, and extraction obtains its content for reading and search. These are separate capabilities: a downloaded scan still needs OCR, while a digital document can be read locally without a model.

## What you can send

The table shows how the CLI chooses an attachment type. Whether a particular file is accepted and how it is processed also depends on MAX. Sending requires an explicit command; extracting text sends nothing to the chat.

| File | Personal account: `messages send --file` | Bot: `bot messages send --file` |
| --- | --- | --- |
| JPG, JPEG, PNG, GIF | Photo | Image |
| WEBP | Photo | File |
| TIF, TIFF, BMP, HEIC | File | Image |
| MP4, MOV, WEBM, MKV | Video; `--as-file` sends the video as a file | Video; `--as-file` sends the video as a file |
| MP3, WAV, M4A, OGG, OPUS, AAC, FLAC | File | Audio |
| PDF, DOCX, XLSX, PPTX, ZIP and other files | File | File |

`--voice` is a separate path for Ogg Opus voice messages, not arbitrary audio. A personal account sends a voice message separately, without text or other attachments. Images are identified by extension, including with `--file`; here `--as-file` changes how a video is sent but does not turn such an image into a document. See [sending](./usage.md) and [bots](./bot.md).

## What you can download

This section applies to personal accounts. Downloading saves bytes; it does not extract text or convert a document to another format.

| Message attachment | `messages download` |
| --- | --- |
| Document or other file with a file ID | Obtains a MAX link and saves the file; its extension does not restrict downloading |
| Video with a video ID | Obtains an available MP4 link; saves the version MAX provides |
| Photo with a link | Saves the available image |
| Voice message with a link | Saves the audio |
| Sticker, event, poll or attachment without an available link/ID | Skips it; its type is listed among skipped attachments |

```sh
max messages download "Учебная группа" 204 --output-dir ./files --json
max attachments list --chat "Учебная группа" --needs-text --json
```

The saved `localPath` is available on the machine running the CLI. A path alone does not transfer a file to a remote agent: the agent needs access to that file or a separate transfer of its bytes.

## Files for a remote agent

An agent on this computer can open the saved `localPath`. An agent on another machine needs the file bytes and suitable readers: a path does not transfer them. Check your AI client’s capabilities and [remote connection method](./remote.md). Receiving a file, reading it and saving text in the index are separate steps.

A remote agent can receive a saved PDF through `attachments show`; if the client does not open PDFs, show each page with `--page`. Viewing a page requires the optional PDF engines; rendering is local, and the agent recognizes the text. If the image is not visible, use MCP `format: base64` and display the PNG with the agent’s own tools. Example and limits: [reading a PDF with a remote agent](./remote.md#читать-pdf-без-сохранения-файла-у-агента).

## How content is read

By default, the agent reads scans and photos with its own tools. `attachments extract --ocr` explicitly enables an API for bulk recognition. Without this flag, extraction does not call a model. Check whether your installed version supports the flag with `max attachments extract --help`.

| Format | Programmatically, locally | Explicit API: `extract --ocr` | When an agent is needed |
| --- | --- | --- | --- |
| TXT, MD, MARKDOWN, CSV, TSV, JSON, LOG | Reads UTF-8, BOM-marked UTF-16 and confidently detected legacy encodings | Still reads locally | Ambiguous encoding needs agent inspection and conversion |
| Other files with MIME type `text/*` or `application/json` | Reads text with the same encoding rules | Still reads locally | If MIME is absent and the extension is unsupported, use an external reader |
| DOCX | Extracts text with `mammoth` | Still reads locally | This extraction does not recognize embedded images or preserve the exact layout |
| PDF with a text layer | Extracts text with `unpdf` | Reads text pages locally | Check column order, tables and extracted text accuracy |
| PDF with scanned or mixed pages | Without text: `needs-agent`; ordinary extraction reads the existing text layer in a mixed PDF | Reads page text; converts pages without text to images using `unpdf` and `@napi-rs/canvas`, then uses a model to recognize them | The usual route for scans; also when an engine is unavailable, limits apply or an API fails |
| JPG, JPEG, PNG, WEBP | `needs-agent` | Sends a supported image to a vision model | By default, the agent reads it itself |
| GIF, HEIC, TIF, TIFF, BMP | `needs-agent`, without built-in conversion | Automatic OCR of these formats is unsupported | The agent needs a suitable viewer or conversion to PNG/JPEG/WEBP |
| DOC, PPT, XLS | No built-in reader for older binary formats | Does not add a reader for these formats | Convert with an installed office application, then read the text or pages |
| ODT | Reads document text and tables locally | Still reads locally | Images and exact layout need the agent |
| ODS, XLSX | Reads sheets in order, cell coordinates and stored values; marks formulas without calculating them | Still reads locally | Charts, formulas without saved values and visual structure need inspection |
| PPTX | Reads slide text in order | Still reads locally | Images, diagrams and exact layout need the agent |
| RTF | No dedicated built-in extractor | Does not add an RTF reader | Convert with a program that understands RTF commands and encoding |
| EPUB | Reads chapter text in book order | Still reads locally | Images and complex layout need inspection |
| ZIP | Does not traverse the archive contents | Does not recognize archive contents | List the files, unpack those needed and process each according to its format |
| Voice message | Separate local speech model: `messages transcribe` | This OCR does not recognize speech | Configure the model and language; see [voice transcription](./audio-recognition.md) |
| Other audio, video, animation and sticker files | Not read by the attachment text extractor | Not recognized by this OCR | Arbitrary audio needs an available speech tool and a suitable format; video needs audio or individual frames |

CSV and JSON become searchable text here, not structured database tables. HTML/XML with a text MIME type is read as source text, not as a browser page. PDF/DOCX extraction saves text, not the original layout. OCR can make mistakes in numbers, reading order and formatting; verify important information against the original.

Legacy encoding detection requires confidence; short or ambiguous text remains for the agent. Source bytes stay unchanged. Failed local reads can retry, and saved agent text remains protected. ODT, ODS, XLSX, PPTX and EPUB are bounded to 1000 parts and 50 MiB expanded, with at most 10 MiB per text XML/HTML part. Malformed or partial files are not indexed as completely read text.

Voice messages are processed separately from documents: the speech model is downloaded once and then runs locally. Commands, language selection and limits are covered in [voice transcription](./audio-recognition.md).

## Required dependencies

Text, ODT, ODS, XLSX, PPTX and EPUB reading is already included in the CLI. The optional packages below are needed for PDF, DOCX and rendering PDF pages.

| Task | Package |
| --- | --- |
| Read a PDF text layer | `unpdf` |
| Read DOCX text | `mammoth` |
| Convert PDF pages to images for API OCR | `unpdf` with rendering support and `@napi-rs/canvas` |
| Read a supported image through an API | PDF/Word packages are unnecessary; a configured vision-compatible API is required |
| An agent reads a file with its own tools and saves the text | These CLI packages are optional; the agent needs its own way to open the file |

Packages are optional and are not installed automatically with the CLI. `engine-missing` means the required package is absent or cannot load. It is not an AI model refusal. `unpdf` reads PDFs and their text layers but does not itself perform OCR on a scan.

Install the package in an environment where the CLI can load it. For a global npm installation using the same prefix:

```sh
npm install -g unpdf mammoth @napi-rs/canvas
```

For a local installation, add the required packages to the same project. With another package manager, a global installation in a separate environment does not guarantee availability: repeat extraction after installation and check that `engine-missing` disappears. Rendering was verified with `unpdf` 1.8.1 and `@napi-rs/canvas` 1.0.10; an older `unpdf` may read text but lack the necessary rendering functions.

## Agent: read and save

```sh
max attachments list --chat "Учебная группа" --needs-text --json
# Агент открывает localPath, читает все страницы и сохраняет буквальный текст в scan.txt.
max attachments text set "Учебная группа" 204 --attachment 1 --text-file ./scan.txt --json
max search messages 'content:умножение' --chat "Учебная группа" --offline --json
```

`--attachment` numbering starts at 1. Preserve the original language and page order; do not replace a transcription with a summary. Do not mark an entire PDF as read after processing just one page. Agent-written text is protected from being overwritten by automatic extraction.

### What the agent actually does

An agent cannot automatically open every file. It needs access to `localPath`, a program to read or convert the format and, for images, a model with vision. It chooses an available method, checks that the result is complete and saves the text through `text set`.

| Source file | How an agent can obtain text |
| --- | --- |
| Text in another encoding | Check the encoding marker or detect the encoding; convert with an available tool, then check readability |
| PDF with text | Use an available PDF reader, such as `pdftotext`; verify column and table order |
| Scanned PDF | Find the page count, convert each page to an image, for example with `pdftoppm`, and read every image with a vision model |
| DOCX/ODT and presentations | Read with a library or installed office application; export pages for visual verification if needed |
| Spreadsheet | Read each sheet with a library or export sheets to CSV; preserve sheet names and rows, and verify numbers and formulas |
| EPUB | Read the chapter list and each chapter’s HTML in book order; unpacking alone does not guarantee the correct order |
| ZIP | Inspect the contents, select the needed files and use the appropriate reading method for each |

These are examples of possible tools, not programs the CLI installs for an agent. If a required tool is unavailable, the agent must report incomplete processing. A remote agent needs the file itself transferred; a path string does not provide that access.

### What affects quality

| Method | What affects the result |
| --- | --- |
| Programmatic text reading | Correct encoding, complete text layer, format support and paragraph/column/cell order; this does not read text inside an image |
| Agent with available tools | All of the above, plus its vision model quality, image resolution, access to every page, context limits and careful verification |
| API OCR | Vision model selected, scan resolution and quality, language, small print, rotation, tables and handwriting; consistent processing of many files helps repeatability but does not guarantee accuracy |

An API is not necessarily more accurate than an agent: they may use similar models. Its advantages here are a managed queue, parallel processing and reuse of results. An agent can combine precise programmatic text reading with visual checks of difficult sections. For a digital document, obtain its original text first instead of recognizing an image of it. With any OCR, check numbers, names and important tables against the original.

## API: explicitly chosen bulk processing

An external model can read text in supported images and scanned PDF pages. The CLI sends it an image of each required page, receives the literal text and saves it in the same `content:` index. PDFs with a text layer and DOCX files still use programmatic reading; selecting an API does not add support for older Office formats or ZIP.

You need a vision model, its endpoint and an API key. Step-by-step setup for OpenAI, Anthropic and compatible servers, key storage and the `models.ocr` task configuration are covered in the [external models guide](./external-models.md). After setup:

```sh
max attachments extract --chat "Учебная группа" --ocr --concurrency 4 --limit 20 --json
```

Repeated extraction uses the file hash and model target; good saved text is preserved on errors, cancellation or incomplete responses. Agent-written text is not overwritten. Images and scanned pages go to the provider only with explicit `--ocr`; calls are billed under its terms. `--offline --ocr` cannot be combined; there is no automatic switch from an agent to an API.

The extraction limit is 50 MiB per file; local text is limited to 2 million characters. API OCR accepts PDFs of up to 20 pages and images of up to 4 MiB and 20 million pixels, with neither side exceeding 8000 pixels. File concurrency is 1–8, default 4; pages within a file run sequentially. By default the API processes up to 100 files; `--limit` accepts 1–500. Continue with the returned `cursor`. A provider response of 429 stops further API calls in that run, without retries. The command returns statuses and message links, not full recognized text.

Downloading, extraction and search are covered in more detail in [search](./search.md). This description matches the CLI source code; the existence of a command does not mean every possible file of that format has been tested against live MAX.
