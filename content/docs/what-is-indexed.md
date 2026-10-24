---
title: "What gets indexed"
description: "Which kinds of content the tools make searchable (text, files, web pages, voice notes, pictures), what each needs, and what never leaves your computer."
---

Find out before you search whether the thing you remember can be found at all: a sentence, a PDF, a voice note, a web page or a photo. Each kind of content becomes searchable in its own way. Some kinds work at once, some need one command, and a few stay off until you turn them on. Indexing runs on your computer and the index lives in the local archive. The exceptions are named where they apply.

## Before you start

Search reads the local archive, not the messenger. Download the chat history first: [Searching](./search.md#fetch-the-relevant-chat-history-first). An empty result does not prove that nothing was sent.

## What each kind needs

| Content | Searchable by | Needs |
| --- | --- | --- |
| Message text | Words, phrases, sender, chat, date | Nothing: on as soon as the message is saved |
| File and document text | Words inside the file (`content:`) | One command: `attachments extract` |
| Web pages (HTML files) | Words in the main text | The same command |
| Voice notes | Words that were said (`transcript:`) | A speech model, once; then `messages transcribe` |
| Phones, emails, links | The value itself, in any spelling | Nothing extra: found in messages, file text and transcripts |
| Pictures, by their surroundings | Meaning of the chat around the photo | A text model, once; then `conversations embed` |
| Pictures, by what they show | English words, such as "dog on a beach" | A setting, a model download and `images embed` |
| Scans and photos with text | Words in the text | An agent reads the image and saves the text |

Two things are true for every row. Files and pictures are read on your computer and are not changed. They go to an outside service only if you choose one: a model service for bulk scan recognition (described below) or a remote model for meaning search.

## Message text

The text of every saved message is indexed with sender, chat, date, links and attachment details. Word search finds other forms of a word ("invoice" finds "invoices"). For an exact phrase, use `exact:`. How the matching works: [How search works](./search-architecture.mdx).

```sh
tg personal search messages invoice
max personal search messages 'exact:"final invoice"'
```

`has:text` keeps messages that have text. Combined with `NOT`, it finds the ones that do not, such as a bare photo:

```sh
tg personal search messages 'has:photo NOT has:text'
```

## Files and documents

`attachments extract` reads the text of files you downloaded and saves it in the archive. After that, `content:` searches inside them. Reading happens on your computer.

```sh
tg personal attachments extract --chat "Book club" --download --output-dir ./files
tg personal search messages 'content:invoice'
```

Readers exist for:

- Plain text: `.txt`, `.md`, `.markdown`, `.json`, `.log`, also in common older encodings.
- Tables: `.csv`, `.tsv`, `.xlsx`, `.ods`, with the sheet, row and column.
- Documents and slides: `.pdf` with a text layer, `.docx`, `.doc`, `.rtf`, `.odt`, `.pptx`, `.odp`, `.epub`.
- Web pages: `.html`, `.htm`, `.xhtml`.

A web page is read for its main text, not its markup. Menus, footers and cookie banners are dropped, and nothing is fetched from the internet. Headings, lists, tables and link text stay.

Files the tools cannot read as text, such as scans and photos, are listed as needing text. Text your agent wrote for them counts as file text, so `content:` finds it.

### Scans and photos with text

Your agent reads the image with its own vision tools and saves the words:

```sh
tg personal attachments list 'chat:"Book club" is:needs_text'
tg personal attachments update "Book club" 204 --text-file ./scan.txt
```

For many scans, you can choose a model service. This is the one place where files leave your computer: `attachments extract --ocr` sends images and scanned PDF pages to the service you configured. Without `--ocr`, no model is called.

## Voice notes

A voice note becomes searchable once it has a transcript. The tool saves the transcript and finds it with a plain word or with `transcript:`.

```sh
max personal models audio download gigaam-v3
max personal messages transcribe "Book club" 204
max personal search messages 'transcript:invoice'
```

- A speech model runs on your computer. The recording does not leave it. Download a model once, with `models audio download`; no model is downloaded on its own.
- Models: `parakeet-v3` covers 25 languages, `gigaam-v3` is best for Russian.
- `tg` can also use Telegram's own transcription where your account has it (`transcribe_with`: `auto`, `messenger` or `local`). `max` always uses the model on your computer.
- Local transcription reads a complete Ogg Opus recording. Longer recordings need more memory and time.
- Transcribing is not instant. `--transcribe` on `messages list` transcribes the voice notes it shows that have no text yet.

In files and transcripts, a word is matched in its exact form. Other word forms are matched in message text only.

## Phones, emails and links

The tools find phone numbers, email addresses, links and Google document links in message text, file text and transcripts, and the names of people you know. Each is stored as a mention. Search finds it however it was written:

```sh
tg personal search messages 'phone:"+1 555 010 0100"'
tg personal search messages 'email:"ana@example.com"'
tg personal search messages 'domain:example.com'
```

`phone:` finds `+1 555 010 0100` and `+1 (555) 010-0100` alike; without the `+`, only Russian numbers are recognized. `domain:` finds every link and address on that site. Mentions are found by rules, not by a model. A mention you reject stays dismissed. How to review mentions and record who they are: [Phones, links and names](./mentions.md). How mentions connect to people and organizations: [How things are linked](./how-things-are-linked.md#mentions).

## Pictures

Pictures are searchable in two ways. Choose by what you remember.

### By the chat around the picture

You remember what people were talking about when the photo came. `conversations embed` gives each photo a piece of text made of its caption, up to 3 messages before and after it within 10 minutes, the chat title and the sender. Search by meaning then finds the photo's message in any language.

```sh
tg personal models download e5-small
tg personal conversations links rebuild --chat "Book club"
tg personal conversations embed --chat "Book club"
tg personal search conversations "photos from the trip" --chat "Book club"
```

A photo with no caption and no message near it gets no piece. To find it, use one of the next ways. Meaning search in general: [Topic search](./tg/topic-search.md).

### By what the picture shows

You remember what the picture looks like. This is off until you turn it on, for one profile at a time. It is in the latest releases of `tg` and `max`; run `images --help` to check yours. In order:

```sh
config set picture_search true
images models download clip-b32
images embed --chat "Book club" --limit 100
search messages "dog on a beach"
```

Put the tool name and your profile name in front of each command, as in the examples above.

- The model is CLIP ViT-B/32, about 155 MB, downloaded once and shared by all profiles.
- `images embed` downloads each stored picture through the messenger, one at a time, and marks nothing read. It keeps a short list of numbers (a vector) and a hash of the picture, then deletes the file. A picture is not read twice. Run it again to continue.
- A message search with words then adds a `pictures` list beside the usual results. It is ranked on its own and never changes the text results. Weak matches are dropped. With the setting off, there is no list. With it on and the model missing, the answer says `picturesSkipped`.
- **Write the query in English.** The model knows English only. Your agent translates a question first: "чек из магазина" becomes "a shop receipt".

Pictures never leave your computer.

## Where the tools differ

| Tool | Messages | Files | Voice notes | Pictures |
| --- | --- | --- | --- | --- |
| `tg` | Yes | Yes | Telegram's transcription or a local model | By surroundings and by content |
| `max` | Yes | Yes | Local model only | By surroundings and by content |
| `memo` | Mail and notes too, with `search all` | Notes folders: text, tables, PDF, Word, slides | No | No |
| `drive` | No | Docs, uploaded text, Sheets, PDF, Word, Excel, CSV | No | By content, images up to 25 MB |

Drive leaves scanned PDFs, Slides, audio and video as names only: a word from the file name finds them, and the result says why there is no text. Details: [Drive search](./drive/search.md), [Memo notes](./memo/notes.md), [Telegram search](./tg/search.md), [MAX search](./max/search.md).

## Limits

- A file over 50 MiB is not read for text. Set `MESSAGING_ATTACHMENT_MAX_MIB` to change it.
- At most 2,000,000 characters of text are read from one file.
- Office archives (`.odt`, `.ods`, `.xlsx`, `.pptx`, `.epub`) are limited to 1,000 parts and 50 MiB unpacked. A file over a limit is reported as too large.
- Scanned PDFs sent to a model service: 20 pages per document.
- Picture content search understands English only.
- Memo keeps at most 200,000 characters of each note file or mail attachment.
- A voice note needs a transcript before its words can be found. An image needs a vector before its content can be found.

## Check the result

Search for a word you know is in a file, a voice note or a picture's chat, and look at where it was found. Each message result says whether the match came from the message text, a transcript, a file name or file text. If a kind of content never appears, check the one step that kind needs in the table above.

Next: [Searching](./search.md) for everyday queries, or the query language for [Telegram](./tg/query-language.md) and [MAX](./max/query-language.md).
