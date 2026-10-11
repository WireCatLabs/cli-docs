# Search mail filters

Readers choosing a sender or email thread should not be told that mail lacks those filters.
This review corrects the Telegram and MAX search guides in English, Russian and Spanish without
changing reviewed release pins or executable examples.

The SDK 0.225.0 already applies `chat:` and `from:` to legacy imported mail. A fresh synthetic
store verified both through that exact published artifact. Notes reject these fields, and unified
search reports the skipped notes resource. Sources:
[message scope](https://github.com/WireCatLabs/cli-messaging/blob/v0.225.0/src/services/messages-search.ts),
[mail route](https://github.com/WireCatLabs/cli-messaging/blob/v0.225.0/src/services/search-all.ts), and
[note fields](https://github.com/WireCatLabs/cli-messaging/blob/v0.225.0/src/store/sqlite/note-search.ts).

Only durable portal corrections are edited. Native client guides were corrected separately in
[TG PR 437](https://github.com/WireCatLabs/tg-cli/pull/437) and
[MAX PR 561](https://github.com/WireCatLabs/max-cli/pull/561). The portal wording makes no newer
claim about dedicated mail storage or unsupported `kind:`/`topic:` fields.

| Page / locale | Reader task | Review and result |
|---|---|---|
| TG search / EN | Filter imported email | TG reviewer read the guide; mail and notes are distinguished correctly |
| TG search / RU | Filter imported email | TG reviewer read the guide; also corrected a task label that called mail a note |
| TG search / ES | Filter imported email | Spanish reviewer read the guide; corrected the mail task label and query-language wording |
| MAX search / EN | Filter imported email | MAX reviewer read the guide; corrected mail/notes distinction |
| MAX search / RU | Filter imported email | MAX reviewer read the guide; corrected mail/notes distinction |
| MAX search / ES | Filter imported email | Spanish reviewer read the guide; also corrected bounded-scan and execution wording |

Openings, command literals, links, imported-mail scope and archive prerequisites remain intact.
The existing release-note and roadmap review remains valid because the pins are unchanged.
This is an affected-guide review, not a new full-corpus release certification.

Validation: refreshed offline command contracts; strict documentation checks with no reference
gaps or invalid examples; localization/preservation checks; 275 unit tests; lint, search-data and
TypeScript checks; seven browser smoke cases with required timeout headroom; six targeted rendered
search guides and their Markdown twins. The first targeted request after relocating the worktree
encountered stale build cache, then a cold compilation exceeded the default navigation timeout.
After regenerating the local cache, the same checks passed without changing deadlines or assertions.
Full export and browser coverage remain deployment gates.
