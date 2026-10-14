---
title: "Limits, waits and background jobs"
---

Use this page when a command waits, stops because of too many requests, or when you plan to download a large amount of history or run several commands at once. It explains how often `max` contacts MAX, why it sometimes waits and what to do when it stops. You will learn which waits are normal, how to adjust the pace and when to try again.

Terms used below:

- **Request rate** — how many requests a profile can send to MAX per minute. `max` keeps each profile within this limit.
- **MAX rate-limit response** — a “too many requests” response. MAX does not publish its limits and temporarily blocks repeated logins.
- **Background job** — a download that continues after the command that started it exits.

`max` stops when MAX rejects a request and does not retry automatically.

## One request rate per profile

Every request `max` makes on behalf of a profile, from a command, `max personal mcp`, `max personal serve` or a background job, waits its turn within that profile’s shared rate:

- The first **10 requests** run immediately, so ordinary commands do not have to wait.
- After that, **20 requests per minute**, about one every 3 seconds, until the initial allowance replenishes.

**Two simultaneous commands share one request rate.** The queue is stored in a file in the state directory (`pace/<профиль>.json`), so two terminals, several `messages sync --background` jobs and `max personal serve` take turns instead of each running at full speed. Five parallel downloads run no faster than sequential downloads and carry no additional risk. Different profiles (different MAX accounts) have their own rates.

A command that must wait more than 5 seconds for its turn reports that in stderr:

```text
waiting 12 s to keep this profile's pace with MAX
```

Change the request rate in the configuration file or use an environment variable for one environment:

```json
{ "defaults": { "requests_per_minute": 10 } }
```

```sh
MAX_REQUESTS_PER_MINUTE=10 max personal messages sync Друзья
```

`0` disables pacing. Use it only for a profile you are willing to put at risk.

## When MAX rejects a request

- **“Too many requests.”** The command stops with exit code `8` (`rate_limited`). MAX's response does not tell `max` how long to wait, so it neither waits nor retries. `messages sync` preserves downloaded data and resumes from the same point on the next run. Wait a few minutes.
- **Too many logins.** MAX rejects login and `max` does not log in again until the pause ends: this applies to every command, `max personal session start` and the background server. Consecutive refusals increase the pause: 1 minute, 5 minutes, 30 minutes, one hour, 6 hours, then one day. A successful login resets it. See [troubleshooting](./troubleshooting.md).
- **If MAX does specify a waiting time**, it applies to the whole profile. The next request from any process waits until it ends; a request that would wait more than 5 minutes returns code `8` immediately without sending anything. `max personal doctor` shows this in `flood`; `max personal flood clear` clears it early if you know the restriction has ended.

## Sending

- **30 sends per hour** per profile by default (`sends_per_hour`), across all processes together; exceeding the limit returns code `8`. See [protection against sending to the wrong place](./security.md#защита-от-отправки-не-туда).
- `max` does not automatically retry a send whose outcome is unknown. MAX recognises a retry with the same `--operation-id` and does not create a second message.

## Download history

- `messages sync` reads pages of 30 messages, pausing 5–10 seconds between pages (`--pause`), with at most 1,200 messages per run (`--limit`). See [local archive](./archive.md).
- `messages download --all` makes a request for each page and each file; file requests follow the same rate limit.
- Member lists and archive gap repairs follow the same rate limit.

## Background jobs

`messages sync --background` and `store gaps repair --background` start jobs that continue after the command exits: one job per chat, each in its own process, all sharing the profile’s request rate. `max personal store jobs list` lists them; `max personal store jobs cancel <id>` stops a job after its current page.

## Bots

Bots have separate Bot API limits. On a 429 response with `retry-after`, a read is retried once after the pause requested by MAX; a send is not retried. See [bots](./bot.md).

## One sign-in for everything

`max personal serve` maintains one connection to MAX. Commands, `max personal mcp` and `max personal watch` use it instead of signing in independently, so simultaneous commands do not add sign-ins. If the server is not running, a command starts it in the background (the `serve` setting). After a disconnection, the server reconnects with an increasing delay, from one second to one minute.
