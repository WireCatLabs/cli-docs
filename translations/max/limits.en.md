---
title: "Limits, waits and background jobs"
---

MAX limits how often an account can contact it and does not publish those limits. Too many requests are rejected, and repeated sign-in attempts can be temporarily blocked. `max` shares one request rate across each profile, stops when MAX rejects a request and does not retry automatically. This page brings those rules together.

## One request rate per profile

Every request `max` makes on behalf of a profile, from a command, `max mcp`, `max serve` or a background job, waits its turn within that profile’s shared rate:

- The first **10 requests** run immediately, so ordinary commands do not have to wait.
- After that, **20 requests per minute**, about one every 3 seconds, until the initial allowance replenishes.

**Two simultaneous commands share one request rate.** The queue is stored in a file in the state directory (`pace/<профиль>.json`), so two terminals, several `store fetch --background` jobs and `max serve` take turns instead of each running at full speed. Five parallel downloads run no faster than sequential downloads and carry no additional risk. Different profiles (different MAX accounts) have their own rates.

A command that must wait more than 5 seconds for its turn reports that in stderr:

```text
waiting 12 s to keep this profile's pace with MAX
```

Change the request rate in the configuration file or use an environment variable for one environment:

```json
{ "defaults": { "requestsPerMinute": 10 } }
```

```sh
MAX_REQUESTS_PER_MINUTE=10 max store fetch Друзья
```

`0` disables pacing. Use it only for a profile you are willing to put at risk.

## When MAX rejects a request

- **“Too many requests.”** The command stops with exit code `8` (`rate_limited`). The MAX response does not tell `max` how long to wait, so it neither waits nor retries automatically. `store fetch` preserves downloaded history, and the next run resumes from the same point. Wait a few minutes.
- **Signing in too often.** MAX rejects sign-in, and `max` does not sign in again until the cooldown ends: this applies to every command, `max session start` and the background server. Consecutive rejections increase the cooldown: 1 minute, 5 minutes, 30 minutes, 1 hour, 6 hours, then 1 day. A successful sign-in resets it. See [troubleshooting.md](./troubleshooting.md) for details.
- **If MAX does specify a wait time**, it holds the whole profile: the next request from any process waits until that time ends. A request that would wait more than 5 minutes immediately returns code `8` without sending anything. `max doctor` shows the active hold in `flood`; `max flood clear` clears it early if you know the restriction has been lifted.

## One sign-in for everything

`max serve` maintains one connection to MAX. Commands, `max mcp` and `max watch` use it instead of signing in independently, so simultaneous commands do not add sign-ins. If the server is not running, a command starts it in the background (the `serve` setting). After a disconnection, the server reconnects with an increasing delay, from one second to one minute.

## Sending

- **30 sends per hour** per profile by default (`sendsPerHour`), shared across all processes. Exceeding the limit returns code `8`. See [security.md](./security.md).
- `max` does not automatically retry a send whose delivery is uncertain. MAX recognizes a retry with the same `--send-id` and does not create a second message (verified with a retry after 15 minutes).

## Download history

- `store fetch` retrieves pages of 30 messages, pausing 5–10 seconds between pages (`--pause`), up to 1200 messages per run (`--limit`). See [archive.md](./archive.md) for details.
- `messages download --all` makes a request for each page and each file; file requests also follow the shared rate.
- Member lists and archive gap repairs follow the same request rate.

## Background jobs

`store fetch --background` and `store gaps repair --background` start jobs that continue after the command exits: one job per chat, each in its own process, all sharing the profile’s request rate. `max store jobs list` lists them; `max store jobs cancel <id>` stops a job after its current page.

## Bots

Bots have their own Bot API limits, separate from account limits. After a 429 response with `retry-after`, a read request is retried once after the delay MAX specifies; a send is not retried. See [bot.md](./bot.md).
