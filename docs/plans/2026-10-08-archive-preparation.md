# Archive preparation — website release record

Reader task: understand why an empty search can miss a message, prepare downloaded history, and use the
coverage/next command before concluding that a message does not exist.

## Implemented

- Telegram [0.35.0](https://github.com/leemour/tg-cli/releases/tag/v0.35.0) pins messaging 0.177.0;
  MAX [0.34.0](https://github.com/leemour/max-cli/releases/tag/v0.34.0) pins 0.176.0. Their tag guides contain
  `store fetch --all`; registry provenance matches their exact checked release commits.
- `content/docs/search-architecture{,.ru,.es}.mdx`: archive preparation after stored ranges; default 90-day
  window, `--since-time 365d`, per-chat run limits and continuation; coverage counts/attention/next and the
  agent recovery rule. A bounded partial archive does not alone trigger next. MAX's one-chat server limit
  and archive-only counting/topic/filter/no-chat paths remain explicit.
- Source map adds v0.174.0 archive/fetch/summary references, separate from the original engine snapshot.
- Handoff now describes reviewed `docsRef` pins rather than automatically selecting newest tags.

## Validation and publication

Passed locally: lint, 208 unit tests, search-language bundle check, reviewed-release sync/production
export, links and SEO. HTML and Markdown exports in all three locales contain the preparation commands,
release boundaries and coverage fields. PR and deployment evidence are tracked in
[website PR #71](https://github.com/leemour/cli-docs/pull/71) and the repository
[deployment runs](https://github.com/leemour/cli-docs/actions/workflows/deploy.yml).
No live messenger actions are needed for this documentation change.

## Completed guide review

The owner requested the full guide update after the shared architecture page shipped. `tools.json`
now pins TG v0.35.0 and MAX v0.34.0 together with the reviewed EN/RU/ES translations, source
fingerprints, start pages and exact portal corrections. All released guide pages are represented.
The generated Telegram Bot API appendix retains its explicitly labeled English source.
See [the guide review record](../reviews/2026-10-08-reviewed-tool-guides.md) for scope and checks.
`pnpm sync` continues to use reviewed tags; a future CLI release does not automatically advance them.

Full guide update and publication: [website PR #72](https://github.com/leemour/cli-docs/pull/72).
