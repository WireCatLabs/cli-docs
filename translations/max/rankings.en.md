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

View, reaction and forward counts are cumulative snapshots. Views, reactions and comments disclose observation freshness per field; old records remain unknown, and forwards have no observation field. Date filters select messages, not reactions during the period. Unknown values differ from zero. An author’s reaction total may be partial: the response shows known and unknown snapshot counts. `--sync-first` checks permissions and downloads new messages within the specified limits, but does not refresh old message counters. Archive and relationship-graph coverage are returned explicitly.

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

## Find questions and posts that need attention

These reports are available in MAX 0.35.0. Update the installed CLI if the command is missing.

After loading the relevant history, ask your agent to show club questions waiting more than a day
and open the original messages. Reports read the stored archive; an empty result does not prove
that there were no questions when history is incomplete.

```sh
max stats messages unanswered --chat Клуб --older-than 24h --json
max stats contacts responses --chat Клуб --answerer 42 --answerer 73 --json
max stats chats newcomers Клуб --since-time 2026-10-01T00:00:00Z --within 7d --json
max stats messages discussion --chat Новости --min-views 100 --max-replies 0 --json
```

`unanswered` orders questions by age. A question contains `?` outside URLs; this is a heuristic.
Only a direct explicit reply from another identifiable human counts. A later answer can qualify
even when its date/text falls outside the question filter. Self-replies and a later speaker without
a reply link do not count. `no-observed-answer` means no qualifying answer in saved history.

`responses` requires repeated `--answerer`: user-selected people, without verifying their past
administrator role. It returns response count, median and p90 latency in milliseconds; no responses
give null timings. P90 uses the nearest rank rounded up. Without `--answerer`, unanswered/newcomer
reports accept any other identifiable human. Bare ids require one scoped account; use
`person:<provider>/<account>/<id>` for several accounts.

`newcomers` defaults to joins in the last 30 days and questions within seven days of a known join.
`--until-time` ends the joining cohort. First observation is not a joining date; these people enter
`summary.unknownJoin`. Rejoining creates a separate stay. Pending help windows and incomplete
member history remain explicit; no saved question does not mean help was unnecessary.

`discussion` examines stored channel posts, comparing known cumulative views with saved direct
discussion replies. Provider comments snapshots are separate; each field discloses observation freshness, unknown when no observation time is available. Missing
counters or links are not zero. Linked discussion needs stored links and its group's history.

Each row has `drilldown.command` and exact arguments. Run the indicated messages/contacts
evidence command with `--component report` and the returned selection. Follow `nextCursor`
with the same arguments; the observation cutoff remains fixed. Source changes require a new report.
Evidence fits64 KiB; narrow chat/dates if the50,000-node or 8 MiB budget is exceeded. Check
`quality.archives` and `quality.graph`, then open the locator with `messages show`.

Save the returned selection with `searches create waiting --selection "$selection"` and rerun the
same report with `--saved waiting`. Accounts, chat, question dates and answerers remain pinned;
explicit options replace inherited values. Every run takes a new reply-observation cutoff.
Another report kind is refused. History keeps parameters/selections, never result messages;
evidence is not recorded.

## Saved rankings

A saved selection pins allowed IDs and dates; new words narrow it. Explicit ranking parameters replace saved ones. `--sync-first` is unavailable for pinned selections. History stores parameters, not results; evidence is not recorded in history. MCP uses the same paths through `max_read`, passing selection as an object.

[Detailed shared specification](https://github.com/leemour/cli-messaging/blob/main/docs/rankings.md) and [CLI standard](https://github.com/leemour/cli-messaging/blob/main/docs/dev/STANDARD.md).

## Retention from roster observations

Ask the agent to show which newcomers in Club were observed after one, seven and thirty days, and which wrote in their first week. This needs known joining dates and saved member lists; a first sighting does not replace a joining date. Old records do not acquire invented roster snapshots.

```sh
max stats chats retention Клуб --checkpoints 1d,7d,30d --within 7d --timezone Europe/Madrid --json
```

By default, joins from the last 90 days are grouped into Monday weeks. `--by day`, `--since-time` and `--until-time` change the cohorts. Choose up to ten increasing positive checkpoint durations. Each checkpoint uses the first saved roster at or after its target, no later than 24 hours afterward; evidence shows the actual time and lag. A partial list can prove presence, but only a complete list proves absence. Without a suitable observation the result is unknown; a future checkpoint is pending. The retention rate uses the observable denominator, with eligible, unknown and pending counts separate. These checkpoints do not prove uninterrupted membership.

Departure lies after the last observed presence and at or before the first complete absence. If that interval crosses the first-week boundary, early departure is unknown. Rejoining starts a separate stay. A saved message proves observed activity; no message means only no-observed-message. `archiveCovered` reports history completeness for that window; incomplete data cannot establish a silent-member percentage for the whole group. Copy a cohort's `drilldown` to `stats messages evidence --component report`. Member evidence pages are bounded to 64 KiB; selections pin the calculation cutoff and changed observations require a new report.

## Check and refresh counters

Ask the agent to check the age of views and reactions, preview at most twenty messages and refresh those exact targets. Sending and storage dates do not establish the counter observation date.

```sh
max stats messages counters show --chat Клуб --counters views,reactions --max-age 24h --limit 20 --json
max stats messages counters refresh --chat Клуб --counters views,reactions --max-messages 20 --sync-time 30s --dry-run --json
```

`show` reads the archive locally. Each counter has a value, observedAt, source, age and freshness: fresh, stale or unknown; the default threshold is 24 hours. Missing is not zero, and refreshing views does not freshen reactions. The returned selection pins exact locators; pass its JSON with `--selection`, without an extra query or scope options.

`refresh` reads the messenger and writes observations locally. It requires an explicit `--chat` or a selection and uses only the active account. Defaults: twenty messages and 30 seconds; maximum: 100 messages and five minutes. Dry-run previews exact targets and supported fields without connecting. It needs message read permission and `stats.messages.counters.refresh` write permission. MAX supports views and reactions; comments is unsupported. Missing fields and partial errors remain explicit. It sends nothing, marks nothing read, requests no view increment and preserves message text, reply links, attachments and tombstones. A legacy writer changing a counter without an observation makes its freshness unknown.

After refresh, run show for the returned selection and inspect each field's observation date. Cumulative counts still do not reveal the views or reactions received within the date-filtered period.
