---
title: "Message and author rankings"
---

Statistics follow `stats → ресурс → вид`: `stats messages top` and `stats contacts top`. These commands read the local archive without connecting. Download the required history first; results describe saved data, not your entire MAX conversation history.

```sh
max stats messages top 'chat:Работа date:[2026-10-01 TO 2026-10-08}' --measure reactions --limit 10 --json
max stats contacts top --chat Работа --score helpful --min-messages 3 --json
max stats contacts top --weights '{"messages":0.4,"active-days":0.6}' --timezone Europe/Madrid --json
```

## Metrics and scores

Message metrics are `views`, `reactions` (default), `forwards`, `comments`, `replies` and `thread-size`. Author metrics are `messages` (default), `words`, `reactions`, `replies`, `answers`, `answer-time`, `threads` and `active-days`. Median `answer-time` is measured in milliseconds and sorted ascending; other metrics are sorted descending.

`helpful` weights answers at 0.5, replies from other people at 0.25 and reactions at 0.25. `active` weights active days at 0.6 and messages at 0.4. `engaging` weights reactions and replies from other people equally; for authors, these are per-message values, with at least five messages unless `--min-messages` is set. `--weights` replaces all weights; `--measure` cannot be combined with score/weights.

Score v1: `100 × sum(weight × value / maximum) / sum(weight)`. Maxima are calculated over the entire eligible selection before `--limit`. A zero maximum contributes zero. Unknown values in positively weighted components exclude a row from scoring; a zero weight ignores that component. The response shows components, maxima, exclusions and data quality.

## Selection and quality

`--message-kind posts|comments` selects a confirmed message type before counting. Older rows without relationship information remain unknown. Queries use strict Lucene; `--chat`, `--source`, `--exact` and `--timezone` work. The limit is 1–100 rows. Reply metrics require a common positive date range; ambiguous date branches are rejected.

View, reaction and forward counts are cumulative snapshots of unknown freshness. Date filters select messages, not reactions during the period. Unknown values differ from zero. An author’s reaction total may be partial: the response shows known and unknown snapshot counts. `--sync-first` checks permissions and downloads new messages within the specified limits, but does not refresh old message counters. Archive and relationship-graph coverage are returned explicitly.

An “answer” is a heuristic: the question contains `?` after URLs are removed, and the first direct reply by another known person counts. Self-replies and channel identities do not count. Words are sequences of letters/digits excluding URLs; active days use the selected time zone.

## Source messages

Each row includes `drilldown.selection` and exact arguments for the evidence command. Pass selection as JSON and the identifier from the row:

```sh
max stats messages evidence msg:max/fixture/room/101 --selection "$selection" --component replies --limit 20 --json
max stats contacts evidence 42 --selection "$selection" --component answers --limit 20 --json
max searches create weekly --selection "$selection"
max stats contacts top --saved weekly --limit 20 --json
```

Evidence shows messages and question/answer pairs. Counter snapshots do not become lists of viewers or people who reacted. An author’s `messages` component shows all selected messages even when ranking by score. Active-day evidence contains source messages, so their individual contributions do not add up to the number of distinct days.

To continue, use the same arguments plus `--cursor` from `nextCursor`. If data changes, start again without cursor. The response includes `total`, `included` and `hasMore`. The items budget is 64 KiB, preserving whole rows; use `messages show` for an oversized row. Fingerprint is limited to 50,000 rows and 8 MiB of input; narrow the chat/date range if exceeded. Selection is limited to 64 KiB.

## Saved rankings

A saved selection pins allowed IDs and dates; new words narrow it. Explicit ranking parameters replace saved ones. `--sync-first` is unavailable for pinned selections. History stores parameters, not results; evidence is not recorded in history. MCP uses the same paths through `max_read`, passing selection as an object.

[Detailed shared specification](https://github.com/leemour/cli-messaging/blob/main/docs/rankings.md) and [CLI standard](https://github.com/leemour/cli-messaging/blob/main/docs/dev/STANDARD.md).
