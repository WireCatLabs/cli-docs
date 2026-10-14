# Drive connection path review

Reader task: install Drive, connect through WireCat's existing Google application and check a first import without creating an application. Readers choosing their own client finish its setup and return to browser approval.

Source: Drive documentation-only commit `658a8b7932741c08d48a89ec0fafcbfa7c3a7485`, `docs/installation.md`. Runtime remains reviewed `v0.4.0`; configuration/search overrides and other tool pins are preserved. Clean bases: Drive `29791bd`, portal `e68225f`.

| Page / locale | Opening and terms | Behavior evidence | Links / export | Review |
| --- | --- | --- | --- | --- |
| Drive installation / EN | Install, named profile, browser approval, first result; shared app first | `src/program.ts` session start's optional client-file; `src/tokens.ts` default read scope; `src/login.test.ts` PKCE flow | Existing heading anchors retained; own-client final command links to connection step 2 | Full page read; reviewed |
| Drive installation / RU | Same flow and explicit default app; no Cloud project/JSON needed | Same released commands and fences | English heading aliases retained; own-client final handoff translated | Full page read; reviewed |
| Drive installation / ES | Same flow and explicit default app; no Cloud project/JSON needed | Same released commands and fences | English heading aliases retained; own-client final handoff translated | Full page read; reviewed |

The MAX installation guide was used for task order: install, verify, explicit profile and first login, then next task. No MAX credential-storage behavior was copied into Drive.

The connection steps distinguish starting sign-in, browser approval and checking the session. First import precedes optional Google Cloud setup. Custom-client setup ends with its own start command and returns to step 2, avoiding another default-app start.

Targeted browser regression checks the same order in all three Markdown exports, final custom-client handoff and rendered heading destinations. No live Google login or account data is involved. Passed: native Markdown lint (19 files), sync, translation structure/current fingerprints, refreshed released-command contracts, strict documentation checks (zero reference gaps and invalid examples), release notes, lint/type checks, seven browser smoke cases and three localized Drive installation cases. Full export and site-wide checks remain in CI.
