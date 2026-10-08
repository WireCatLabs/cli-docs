---
title: "External models: API setup"
---


This guide helps you connect a model to the CLI: choose a provider, save a key, configure a model for a specific task and invoke it explicitly. Here the model is called through an API, rather than through the agent’s own tools; availability, pricing and capabilities depend on the provider.


## Tasks that use an API


| Task | Setting | How it runs |
| --- | --- | --- |
| OCR for images and scanned PDFs | `models.ocr` | `attachments extract --ocr`; requires an image-capable model |
| Analyze conversation links in saved messages | `models.analysis` | `conversations build --analyze`; consent applies to a specific chat and provider |
| AI block in a reply template | `models.replies` | A rule with an `{% ai %}` block and separate consent for replies; see [reply rules](./replies.md) |
| Shared values for these tasks | `models.default` | Used for fields not set for a specific task |

Semantic search has separate settings, `embeddingProvider`, `embeddingModel` and `embeddingBaseUrl`, but can use the same key storage mechanism. See [search](./search.md). Voice transcription uses a separate local speech model; see [voice transcription](./audio-recognition.md).


The `models.ocr` setting does not choose your agent’s model. When the agent reads a file with its own tools, it uses its own tools and model.


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

For a custom endpoint, the key name is its host, including the port if specified in the URL. The `baseUrl` field itself is not a key. Supporting ordinary text requests does not imply support for vision OCR; check your server’s documentation.


To return to the standard OpenAI endpoint, remove `models.ocr.baseUrl`. Text and Anthropic-compatible APIs cannot be mixed simply by replacing the URL: choose the adapter matching the server protocol.


## Profile, shared defaults and one run


The `config set` commands above change the selected profile. Put its name first, for example `max work config set models.ocr.provider openai`, or add `--defaults` for shared values. You can configure one task independently: `models.ocr.*` does not replace `models.analysis.*` or `models.replies.*`.


Each field is taken first from its environment variable, then from profile settings and shared defaults. Unset fields may inherit from `models.default`. For example, for one run in a POSIX terminal using an already saved key:


```sh
MAX_MODELS_OCR_PROVIDER=openai MAX_MODELS_OCR_MODEL=gpt-4o-mini max attachments extract --chat "Учебная группа" --ocr --limit 1 --json
```

In PowerShell, set the corresponding `$env:MAX_MODELS_OCR_PROVIDER` and `$env:MAX_MODELS_OCR_MODEL` variables. `MAX_MODELS_OCR_BASE_URL` overrides the endpoint. Keys can use `MAX_OPENAI_API_KEY`/`OPENAI_API_KEY` and the corresponding Anthropic variables; do not put their values in examples or command history.


`models.ocr.provider off` disables this task. `config show` displays settings and the source of each value. Full reference: [configuration](./configuration.md).


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

Successful OCR results are saved for search; repeated extraction uses the file hash and selected model target. Errors do not delete good text saved previously, and agent-written text is not overwritten. Formats, dependencies and limits are described in the [attachments guide](./attachments.md).

