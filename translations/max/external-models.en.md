---
title: "External models: API setup"
---

<a id="какие-задачи-используют-api" />

Use this page when `max` needs to call an AI service itself: to read text from scans and images, analyse relationships between discussions or complete a reply template. You will learn to choose a provider, save its key, select a model for one task and test it on a small amount of data.

Terms used below:

- **External model** — an AI component running on a provider's server, such as OpenAI or Anthropic. `max` sends data to it over an API.
- **API** — how a program calls a service. A **key** is the provider's secret that grants access. Pricing, limits and capabilities depend on the provider.
- **Purpose** — the task for which a model is selected: `models.ocr`, `models.analysis` or `models.replies`. Each can have its own provider and model.
- **Endpoint** (`baseUrl`) — the server address receiving the request.

These settings do not control your AI agent. When the agent reads a file itself, it uses its own tools and AI configuration.

## What you can connect

| Task | Setting | How it runs |
| --- | --- | --- |
| OCR for images and scanned PDFs | `models.ocr` | `attachments extract --ocr`; requires an image-capable model |
| Analyze conversation links in saved messages | `models.analysis` | `conversations build --analyze`; consent applies to a specific chat and provider |
| AI block in a reply template | `models.replies` | A rule with an `{% ai %}` block and separate consent for replies; see [reply rules](./replies.md) |
| Shared values for these tasks | `models.default` | Used for fields not set for a specific task |

Search by meaning has separate settings: `embeddingProvider`, `embeddingModel` and `embeddingBaseUrl`. It stores keys in the same way. See the [search guide](./search.md). Voice transcription uses a separate speech-recognition component on your computer, without an API; see [voice transcription](./audio-recognition.md).

## OpenAI: configure OCR


Choose the exact ID of an image-capable model. The example below uses `gpt-4o-mini`; substitute the value for another model. First save the key through hidden interactive input, then configure the task:


```sh
max models text key set openai
max config set models.ocr.provider openai
max config set models.ocr.model gpt-4o-mini
max config show
```

The key is not passed as a command argument and is not stored in the settings file’s `models` field. `key set` also accepts a secret through stdin; your secret manager should supply it. Do not put the key itself on the command line.


If `baseUrl` is neither set nor inherited from `models.default`, the standard OpenAI endpoint is used. To test a small batch:


```sh
max attachments extract --chat "Учебная группа" --ocr --concurrency 1 --limit 1 --json
```

`--limit 1` limits files, not API calls. A PDF with several scanned pages may require one call per page. A text PDF or DOCX may be processed locally without calling a model. The call count is not the file count.


## Anthropic

Choose the exact ID of a vision model available to you; `your-vision-model` below is a placeholder for your value, not an actual model name.


```sh
max models text key set anthropic
max config set models.ocr.provider anthropic
max config set models.ocr.model your-vision-model
max config unset models.ocr.baseUrl
```

The last command removes any previous endpoint override. If the URL is not inherited from `models.default` either, the standard Anthropic endpoint is used.


## Compatible server or shared gateway

An OpenAI-compatible endpoint uses the `openai` adapter even if another provider owns the server. It must support the relevant API and images, not only text requests. Configure a URL without a key, query parameters or a fragment:

```sh
max config set models.ocr.provider openai
max config set models.ocr.model your-vision-model
max config set models.ocr.baseUrl https://gateway.example.org/v1
max models text key set gateway.example.org
```

For a custom endpoint, the key name is its host, including the port if the URL specifies one. The `baseUrl` field itself is not a key. A server accepting text does not necessarily accept images; check its documentation.

To return to the standard OpenAI endpoint, remove `models.ocr.baseUrl`. Text and Anthropic-compatible APIs cannot be mixed simply by replacing the URL: choose the adapter matching the server protocol.

## Profile, shared defaults and one run

The `config set` commands above change the selected profile. Put its name first, for example `max work config set models.ocr.provider openai`, or add `--defaults` for shared values. You can configure one task independently: `models.ocr.*` does not replace `models.analysis.*` or `models.replies.*`.

Each field is taken first from its environment variable, then from profile settings and shared defaults. Unset fields may inherit from `models.default`. For example, for one run in a POSIX terminal using an already saved key:

```sh
MAX_MODELS_OCR_PROVIDER=openai MAX_MODELS_OCR_MODEL=gpt-4o-mini max attachments extract --chat "Учебная группа" --ocr --limit 1 --json
```

In PowerShell, set the corresponding `$env:MAX_MODELS_OCR_PROVIDER` and `$env:MAX_MODELS_OCR_MODEL` variables. `MAX_MODELS_OCR_BASE_URL` overrides the endpoint. Keys can use `MAX_OPENAI_API_KEY`/`OPENAI_API_KEY` and the corresponding Anthropic variables; do not put their values in examples or command history.

`models.ocr.provider off` disables this purpose. `config show` displays settings and the source of each value. See [configuration](./configuration.md) for profiles and shared defaults.

## Consent, data and cost


For OCR, explicit `--ocr` permits sending the selected images and scanned pages to the configured model; consent for analysis or automatic replies does not replace this choice. OCR does not turn on automatically when an agent cannot read a file. `--offline --ocr` cannot be combined.


Analysis requires separate consent for the chat/provider. Automatic replies have their own consent and can send messages: configuring a key alone does not authorize sending. Follow [reply rules](./replies.md) before enabling AI blocks.


An API may charge for images as well as input/output text. Check the selected model’s prices and limits with its provider; use a small scope and `--limit` for the first run. Parallel processing is faster but does not reduce data volume or guarantee accuracy. Poor scans or an unsuitable model can produce errors even after a successful HTTP response.


## If a call fails

| Result | What to check |
| --- | --- |
| Provider or model is not configured | `config show`, task fields and inheritance from `models.default` |
| Key is missing or the provider refused | Correct key name, profile, endpoint and model access; do not print the key to check it |
| Server does not accept images | API compatibility and the selected model’s vision capabilities |
| `engine-missing` for a PDF | Local `unpdf` and `@napi-rs/canvas`; this is not an API error |
| No text or insufficient text | Image quality and completeness, response format, model and OCR limits |
| Rate limit | Wait the time allowed by the provider and start a separate run; after 429, new OCR calls stop for the current run |

Successful OCR results are saved for search; subsequent runs use the file hash and selected model target. An error does not delete previously saved good text, and text saved by an agent is not overwritten. See [attachments](./attachments.md) for formats, dependencies and limits.
