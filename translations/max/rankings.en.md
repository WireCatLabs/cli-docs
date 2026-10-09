---
title: "Statistics"
---

See which messages attracted attention, who needs an answer and how group membership changes. Reports use saved history. If the relevant messages are missing, [download the history](./archive.md) first.

The requests, names and results below are fictional examples. Replace the chat name with yours. Tables show how an agent can present its answer; commands with `--json` return data for it.

## Messages people react to

Find the messages with the most recorded reactions.

**Your request:**

> Show the three most-reacted-to messages in Поход.

**Command:**

```sh
max stats messages top --chat "Поход" --measure reactions --limit 3 --json
```

**Example agent answer:**

> | Message | Reactions |
> | --- | ---: |
> | Packing list | 18 |
> | Trip photos | 11 |
> | New route | 7 |

Your agent can open the original messages so you can check the context. Counters are cumulative totals, not reactions received only during a selected period.

## Who answers questions

Compare people by their observed answers to questions.

**Your request:**

> Who answered the most questions in Поход? Show three people.

**Command:**

```sh
max stats contacts top --chat "Поход" --measure answers --limit 3 --json
```

**Example agent answer:**

> | Person | Answers |
> | --- | ---: |
> | Алекс | 4 |
> | Lena | 2 |
> | Sam | 1 |

Answer counts help you find examples of participation; they do not prove a person’s helpfulness.

<a id="find-questions-and-posts-that-need-attention" />

<a id="вопросы-и-посты-которым-нужно-внимание" />

## Questions waiting for an answer

Find older questions without an observed direct answer.

**Your request:**

> Which questions in Поход have waited more than a day?

**Command:**

```sh
max stats messages unanswered --chat "Поход" --older-than 24h --json
```

**Example agent answer:**

> **One question has no observed answer.**
>
> | From | Question | Waiting |
> | --- | --- | --- |
> | Ira | Who will bring the cooking pot? | 2 days |
>
> History is incomplete: an answer may be missing from the archive.

Questions are detected by a question mark outside links. A direct reply from another known person qualifies; an unrelated next message does not close the question.

## How quickly someone replies

See the number of answers and waiting times for a selected person.

**Your request:**

> How quickly does Алекс answer questions in Поход? Show an example.

**Command:**

```sh
max stats contacts responses --chat "Поход" --answerer "Алекс" --json
```

**Example agent answer:**

> | Metric | Result |
> | --- | --- |
> | Observed answers | 1 |
> | Median waiting time | 2 days |
> | p90 waiting time | 2 days |
>
> Both values come from one answer, so the sample is small. I can open the question and its linked answer.

The median is the middle observed waiting time; p90 is the upper boundary for about 90% of answers. Selecting a person does not establish that they were an administrator in the past.

## Help for newcomers

Check whether people who recently joined received answers to their questions.

**Your request:**

> Did newcomers to Поход get help during their first week?

**Command:**

```sh
max stats chats newcomers "Поход" --within 7d --json
```

**Example agent answer:**

> | Newcomer | Questions | Answered |
> | --- | ---: | ---: |
> | Kate | 2 | 2 |
> | Oleg | 1 | 0 |
>
> Oleg has no observed answer. One person’s joining date is unknown, so their first week was not calculated.

By default, the report selects joins from the last 30 days. First seeing someone in the archive does not establish their joining date.

<a id="retention-from-roster-observations" />

<a id="удержание-новичков" />

## Do newcomers stay?

Compare observed membership one day, one week and one month after joining.

**Your request:**

> How many Поход newcomers stayed after a day, a week and a month? Show gaps in the data.

**Command:**

```sh
max stats chats retention "Поход" --checkpoints 1d,7d,30d --within 7d --timezone UTC --json
```

**Example agent answer:**

> | After joining | Stayed among observable members | Unknown | Not due yet |
> | --- | --- | ---: | ---: |
> | 1 day | 1 of 1 — 100% | 1 | 1 |
> | 7 days | 1 of 2 — 50% | 0 | 1 |
> | 30 days | No observable denominator | 2 | 1 |
>
> The denominators differ, so these percentages are not a complete retention curve. No observed message does not prove that someone was silent.

This needs known joining dates and saved member lists. Absence from a partial list remains unknown. [Member observations](./groups.md) help collect data for later reports.

## Posts without discussion

Find viewed posts with little recorded discussion.

**Your request:**

> Which posts in Новости received views but no discussion?

**Command:**

```sh
max stats messages discussion --chat "Новости" --min-views 100 --max-replies 0 --json
```

**Example agent answer:**

> | Post | Stored views | Observed replies |
> | --- | ---: | ---: |
> | New route | 240 | 0 |
>
> This is an absence of discussion in available history. Missing comments could change the conclusion.

<a id="check-and-refresh-counters" />

<a id="свежесть-счётчиков" />

## How fresh are the counts?

Check when views and reactions were observed separately.

**Your request:**

> Check the age of Поход’s view and reaction counts without refreshing anything.

**Command:**

```sh
max stats messages counters show --chat "Поход" --counters views,reactions --max-age 24h --limit 20 --json
```

**Example agent answer:**

> | Message field | Value | Observed |
> | --- | ---: | --- |
> | Views | 0 | 1 hour ago — fresh |
> | Reactions | 0 | 3 days ago — stale |
>
> Fields have independent freshness. A missing value is shown as unknown, not zero.

### Preview a refresh

Before fetching new counters, ask for the exact messages and limits.

```sh
max stats messages counters refresh --chat "Поход" --counters views,reactions --max-messages 20 --sync-time 30s --dry-run --json
```

> **Plan:** at most 20 messages, up to 30 seconds. Views and reactions are supported.
> This is a preview: no connection or refresh has occurred.

A real refresh needs your request. It reads counters from MAX and saves observations locally; it sends no messages, marks nothing read and requests no view increment. MAX refreshes views and reactions; comments are unsupported.

<a id="scope-and-quality" />

<a id="names-and-unknown-response-activity" />

<a id="selection-and-quality" />

<a id="выборка-и-качество" />

<a id="человек-по-имени-и-неизвестная-активность" />

## If a name or history is unknown

When several people match, the agent shows candidates and asks you to choose. Failing to identify someone does not mean zero activity. Even an explicitly selected ID without observations remains unknown: JSON exposes `identityKnown: false`, `status: unknown`.

An empty report with incomplete history does not establish that there were no questions or answers. Ask the agent to open the source messages and show the available-history limits.

<a id="measures-and-scores" />

<a id="follow-the-evidence" />

<a id="save-a-resolved-ranking" />

<a id="metrics-and-scores" />

<a id="source-messages" />

<a id="saved-rankings" />

<a id="метрики-и-оценки" />

<a id="исходные-сообщения" />

<a id="сохранённый-рейтинг" />

## More control

You can select a period, choose a measure or combined score, and save a selection for another report. Scoring formulas, exact evidence arguments and page limits live in the [shared statistics specification](https://github.com/leemour/cli-messaging/blob/main/docs/rankings.md) and [command reference](./commands.md).

To verify a finding, ask the agent to open the question, answer or members behind that report row. Before the next report, [check archive coverage](./archive.md).
