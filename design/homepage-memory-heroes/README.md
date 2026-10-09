# Outcomes page: original-conversation hero variants

The selected Outcomes blocks and purple/green palette are retained. Hero compatibility shows Telegram, MAX and Email; Obsidian remains in the lower tool inventory only. Three variants use the current landing's exact dialogue, tool-call markup and original sources, including Telegram/MAX alternatives:

- `/chat`: first exchange, with the rest of the original conversation expandable.
- `/walkthrough`: original exchanges shown one at a time with Previous/Continue controls.
- `/answer`: the final request and answer, with earlier conversation expandable.

The lower three-column strip now contains useful features from Less busywork: subscription digests, collecting current files and unanswered group questions. Six Why features, Outcomes blocks, setup dropdowns and the current footer remain.

```sh
node design/homepage-memory-heroes/build.mjs
node design/homepage-memory-heroes/serve.mjs 4328
```

Service: `wirecat-homepage-memory-heroes.service`. Existing prototypes at4325/4326/4327 remain unchanged. Transcript content comes from `lib/landing/en.json`; class and ID namespaces adapt styling safely. Examples demonstrate tool use and do not execute messenger actions.

Conversation roles are explicit: Your request, Tool calls and Agent response. Tool calls are grouped by exchange; expanding a command reveals the labeled JSON tool output. Labels, alignment and surfaces distinguish roles in both themes while preserving original content and copied requests.
