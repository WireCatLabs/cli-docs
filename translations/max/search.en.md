---
title: "Message search"
---

`max messages search` searches only the shared local archive, without network access or read receipts.

## Quick start

```sh
max messages search 'invoice AND (kind:group OR kind:private)' --json
max messages search 'from:"Alice Synthetic" date:[2026-01-01 TO 2026-02-01}' --timezone Europe/Madrid --json
max messages search 'preset:secret kind:saved' --json
max messages search 'text:/pass(port)?/' --json
max messages search 'chat:"Работа" AND body:/.*invoice.*/' --json
max messages search 'has:file' --json
```

Replace example names with your own. Words and phrases match strictly, without automatic typo correction or substring search. `alpha OR beta gamma` means `(alpha OR beta) AND gamma`; `alpha OR beta AND gamma` means `alpha OR (beta AND gamma)`. Use parentheses for clarity.

## Fields and operators

Supported fields are `text/body/from/chat/date/kind/has/topic/in/preset`, with Boolean groups, field-value groups, inclusive and exclusive ranges, limited wildcards and Lucene regex. `topic` requires exactly one chat. `kind:bot` selects a bot conversation partner; `in:bots` selects Bot API accounts. `filename/mime/size/tag` are not supported yet; fuzzy, proximity, boosts and intervals also produce errors. Unknown fields do not become plain text.

## Dates and regex

`--timezone` sets an IANA time zone; a date without a time means a calendar day. An inclusive upper bound includes the entire day; an exclusive bound excludes it. Daylight-saving changes can make a day shorter or longer than 24 hours. Quote exact timestamps and include seconds and a UTC offset.

Regex on `text` matches an entire normalized word; `body` matches the full original text, case-sensitively. Use `.*` for a substring in `body`. A subset of Lucene regex is supported, without JavaScript lookaround, backreferences or flags. Exceeding limits on rows, bytes, automaton states, work or time produces an explicit error; narrow your search.

## Archive coverage and machine-readable output

An empty result does not prove that a message is absent from the messenger. JSON reports the query version, completeness, account/chat coverage and index readiness even without matches. `lastSyncedAt` is currently `null`; a profile’s chat list is not treated as complete. JSONL contains only `items`; use `--json` for coverage information. An unready word index requires `max store migrate`; fetch missing history with `max store fetch`. Built-in predicates find candidates, rather than confirming whether credentials are valid.

## Migrating from legacy

```sh
max messages search 'from:alice after:7d invoice -draft' --language legacy --json
max messages search --regex 'invoice\s+\d+' --json
```

Legacy preserves the previous filters and typo correction. `--regex` is a separate JavaScript `iu` mode over the full text, with an isolated worker and limits; combining `--regex --language lucene` is rejected. The saved-query programmatic contract includes `language/version`; the migration preview does not promise to preserve results from typo-correcting searches.

## Full reference

The [main query-language reference](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language.md) covers fields and operators, Unicode and escaping, built-in predicates, limits, errors and ten testable recipes. The [technical specification](https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language-spec.md) describes the fixed grammar, AST/schema, reference examples and compiler. [Archive](./archive.md) explains fetching and completeness; [commands](./commands.md) lists current options.

## Search through MCP

`max_messages_search` uses the same language and service as `messages search`. A query contains `text` or a versioned `ast`; `language` selects `lucene` or `legacy`, while `timezone` sets the calendar time zone. `chat` accepts an ID or a name from the local store; `source`, `newest`, `context` and `limit` select coverage and result presentation.

The response keeps `query`, `coverage`, `completeness`, `wordsReady` and `corrections` alongside the usual `items/page/limit/hasMore` page, including when there are no matches. Metadata describes the local archive, rather than completeness of the remote chat. The tool’s permissions and name remain unchanged.
