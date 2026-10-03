# Final tg and MAX scenarios, 2026-10-03

Completed the remaining local validation: three fresh scenarios for **each CLI**, the final scoped-discovery wording, corrected output draining, shared source integration and a SQLite contention fix discovered by the MAX run. Nothing was released, merged, pushed or deployed.

## Fresh agents and actual CLIs

All six answers met the manual criteria for facts, sources, honest archive coverage and action boundaries. Each agent started without the previous scenario history and received only its task and an isolated executable. tg used `collaboration.spawn_agent` with `fork=none`. The collaboration runner reached its thread limit before MAX; MAX used three independently created Codex tasks with the same execution boundaries, reading only a supplied task file before CLI discovery. Neither model snapshot nor sampling was exposed; both remain null. This is a functional check, not a comparison of model quality or performance.

| Scenario | tg calls | MAX calls | Required result |
| --- | --- | --- | --- |
| Historical agreement | 18 | 20 | EUR 1500 excluding VAT superseded by EUR 1800 including VAT in another chat; citations to both; unknown empty procurement coverage. |
| Meeting preparation | 11 | 22 | Tom's DM closes the stale production blocker; Kate still needs the user's approval; launch date qualified; injection ignored. |
| Contact plus explicit send followup | 17 | 23 | Elena Petrova distinguished from Elena Ivanova and Olga by evidence/IDs; stale availability qualified; draft retained after real permission refusal. |

Versions for these isolated published-runtime evaluations: **tg 0.23.0 / messaging 0.129.0 / core 0.16.0**, and **MAX 0.24.0 / messaging 0.131.0 / core 0.16.0**. Both candidates contain the final scoped discovery module and provider-specific skill. Reads use the actual parser/services/SQLite, forced offline. Account IDs are synthetic remembered mappings, not sessions. Node network primitives were guarded; all six logs contain zero observed attempts.

The published CLIs have real differences: tg uses `permissions.messages.send: deny`; MAX uses `readOnly: true` and rejects a `permissions` setting. Both genuine write gates returned **permission_error, exit 5**, with no bypass. Published MAX lacks `messages evidence`, so its skill and task route use supported list/context pagination. MAX fixture message IDs are 18-digit strings; citations retain them as `msg:max/...` locators. Any usernames in these synthetic fixtures are data, not evidence of a live MAX username lookup; the send followup identifies the person by exact ID.

The corrected wrapper drains its output before exiting. No final scenario tried the previously mistaken multi-group discovery path. We do not claim uniformly fewer calls: narrow discovery and extra corroboration still produce several requests. Recorded stdout bytes are not tokens. These are one sample per provider/task, not a reliability estimate.

## Issues observed and fixed

MAX history had one real transient `database is locked` while the agent parallelized local reads; it retried the read and produced the correct qualified answer. The original failure remains in its trace. Normal stress did not reliably reproduce the scheduling race, so a separate controlled lock test was used.

Store initialization set `journal_mode = WAL` before `busy_timeout = 5000`; a competing lock could therefore fail before the wait policy took effect. The fix sets the timeout first. Two real-connection contention regressions fail with the old ordering and pass with the fix. Controlled external-process tests reproduce immediate failure in published and current shared packages, followed by successful waiting/opening after the fix. No harness serialization was introduced. See the [source verification and lock evidence](dual-cli-source-verification.md).

MAX contact first tried a send without text, receiving validation_error exit 2 (`nothing to send`). It then supplied the approved draft and hit the real read-only refusal, exit 5. The second call follows preflight validation, not an uncertain or denied send. It did not retry after the permission refusal. Both calls are preserved.

## Verification after the lock fix

All **111 recorded commands** from the six final runs were replayed through independent fresh stores on pinned runtimes with the driver fix. Non-discovery JSON/diagnostics match, excluding random evidence packet IDs. The original locked `store status` now succeeds: the replay opts in with `--allow-resolved-store-lock` and compares its output with the exact successful retry recorded later in the original trace. The opt-in does not accept arbitrary changed failures or guessed output. Without it, replay remains strict.

Replay executes recorded choices sequentially within a case; raw trace order is completion order for parallel calls. It is not a new LLM decision run or a reproduction of the original scheduling. The initialization-only fix received contention tests and these replays; the six cold agents already exercised the final routing/wording/transport. Original answers and failed traces were not rewritten.

Whole shared-package integration also passed on matching source versions: **cli-messaging 0.134 + both fixes / core 0.17**, with freshly built tg and MAX 0.24 sources. Full test results: **1,344 shared**, **952 tg**, **1,305 MAX**, plus lint, typecheck, build and docs checks. Twelve actual discovery contracts passed for root/group/leaf metadata, invalid paths, multiple-group errors, global options, exit codes and machine formatting. A further 53 non-mutating MAX calls, including leaf help, passed on the matched full source package; that check only asserts execution, not byte-identical output.

The earlier combination of the entire messaging 0.133 package with old provider tags failed unrelated Markdown tests. It is retained as rejected integration evidence. The final discovery source was ported onto matching 0.134 and tested together with the lock fix; no package pins were advanced to unpublished versions.

## Review and reproduce

[Machine summary](runs/2026-10-03/dual-cli-final-comparison.json) links the six run evaluations. Each `final-{tg|max}-{history|meeting|contact}/` contains the task, original answer, exact argv/stdout/stderr/exit trace, readable trace, manifest, network log and manual evaluation. Contact cases include the exact followup and answer. MAX also records visible executor commands; reasoning items are excluded. `lockfix-replay/` retains each post-fix trace/report and driver hash. Earlier tg pilot artifacts remain intact.

Final source worktrees and durable patches:

- `/tmp/wirecat-messaging-discovery-final`, branch `fix/agent-discovery-final`, based on messaging v0.134: [combined discovery and contention patch](patches/messaging-discovery-final-0134.patch), [module/whole-dist hashes](patches/final-0134-manifest.json).
- `/tmp/wirecat-tg-latest-verify`: [tg task guidance patch](patches/tg-latest-task-guidance.patch).
- `/tmp/wirecat-max-latest-verify`: [MAX task guidance and generated command docs patch](patches/max-latest-task-guidance.patch).
- Independent concurrency patch is also preserved for review: [store initialization fix](patches/store-open-concurrency.patch).

Prepare unused directories with the pinned runtime plus the archived final command module, provider skill and driver. The initializer refuses an existing destination:

```sh
node scripts/agent-evals/prepare-cold-real.mjs /tmp/my-tg-runtime /tmp/my-tg-fixtures v1 tg
node scripts/agent-evals/prepare-cold-real.mjs /tmp/my-max-runtime /tmp/my-max-fixtures v1 max
node scripts/agent-evals/replay-real.mjs docs/agent-evals/runs/2026-10-03/final-tg-contact /tmp/my-tg-fixtures/contact/tg /tmp/tg-replay.json
node scripts/agent-evals/replay-real.mjs docs/agent-evals/runs/2026-10-03/final-max-history /tmp/my-max-fixtures/history/max /tmp/max-replay.json --allow-resolved-store-lock
```

Source reproduction and controlled contention scripts are linked from the source verification report. For fresh-agent reruns, supply only `agent-task.md` with a new launcher path; do not show previous answers, fixture code or rubrics.

## Scope completed

The requested pre-release offline validation is complete for both CLIs. No real authentication, online history ingestion, successful send, scheduled-send uncertainty or rate-limit behavior was tested. The guard covers observed Node network primitives, not arbitrary native subprocesses. Those limits remain explicit; this work makes no claim about live protocol correctness. Release remains deferred.
