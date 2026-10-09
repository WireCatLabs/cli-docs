# Memory homepage variants

Four complete comparison prototypes retain the selected Memory heading/layout while testing user outcomes, account/bot/admin uses, find/check/act, and an optional time estimate. Light palettes are independently selectable; every dark view uses the existing production palette. Prior prototypes remain at ports4325 and4326.

```sh
node design/homepage-memory/build.mjs
node design/homepage-memory/serve.mjs 4327
```

Routes: `/`, `/outcomes`, `/roles`, `/workflow`, `/calculator`, `/examples?case=context` (all eight current landing scenarios).

Hero summaries are adaptations of reviewed `lib/landing/en.json` sessions. The examples page retains full transcripts, tool calls and source messages. Footer markup comes from `footerHtml`, with the same contacts/logo/installation placement as `SiteFooter`; its copy and navigation are preserved. Local footer link destinations are rebased to the public site. Footer/theme CSS snapshots come from the production files.

Connect dropdowns provide the actual docs' setup request from `wordsFor('en').onboarding.prompt`, provider choice, copy actions, terminal commands and sign-in guide. Header navigation opens pages; connection controls do not scroll. The calculator uses the existing `lib/time-savings.ts` formula and editable assumptions, including negative savings.

Transient user service: `wirecat-homepage-memory.service`, port4327. Restart: `systemctl --user restart wirecat-homepage-memory.service`.
