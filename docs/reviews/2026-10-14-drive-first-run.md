# Drive first-run reader review

Reader: someone installing Drive for the first time, with or without a terminal agent. Result: installed command, account authorized through the default WireCat app, a selected folder saved locally and a known-word search with a source link. Alternate route: configure an own Desktop client, then rejoin browser approval.

Clean bases: portal `43ccafc`; Drive `658a8b7`. Native reviewed guide: `ec76984c78f664dc806829fdd13b6f5a2c8932ad`, `docs/installation.md`. Runtime pin remains Drive `v0.4.0`. No command behavior or account data changes.

## Pass 1: compare existing reader paths

| Reference | Useful pattern | Drive correction |
| --- | --- | --- |
| Shared `content/docs/installation.mdx` | Distinct agent/manual paths; choose computer; a small first result | One installation choice with an explicit handoff, then a shared three-step journey |
| MAX `v0.49.0`, `docs/installation.md` | npm distribution, runtime readiness, version/help check, named profile; update/removal later | Node/npm check in the manual branch; installation success before account connection; maintenance after first use |
| Telegram `v0.53.0`, `docs/installation.md` | Installation is separate from account authorization and downloading history | Separate installation, browser consent and selected-folder ingestion; no claim that login imports Drive |
| Zoom `v0.10.0`, `docs/installation.md` | Distinct app registration/account authorization; browser approval waits for terminal completion | Default app requires no client download; optional setup folded; completion tied to terminal result |

The old agent request also asked for the account/folder, then the page presented npm as if it were the next step. The rewrite scopes that request to installation, marks manual installation as Option B and tells agent-assisted readers to skip it. Package-manager alternatives and uninstall commands no longer interrupt first use.

## Pass 2: walk every path and verify claims

| Path | Actions and handoff | Success check |
| --- | --- | --- |
| Agent, default app | Installation-only prompt → skip manual branch → step 2; agent runs commands, user approves Google | Command starts; terminal sign-in completes; first import and passage |
| Manual, default app | Node/npm → npm package → version/help → step 2 → step 3 | Same account/data result |
| Already installed / signed in | Opening links directly to step 2 / step 3 | First selected-folder import verifies access |
| Own app, new client | Open optional disclosure → project/APIs/consent/test users/scopes/client JSON → custom start → browser approval | Same terminal completion and import; no second default-app start |
| Own app, existing JSON | Direct link to last custom step → custom start → browser approval | Same result without repeating Cloud setup |

Evidence: Drive `src/program.ts` session options/output, `src/login.ts` returns `signed_in: true` after saved credentials, `src/tokens.ts` default read scope, sync/status/search commands and native usage/configuration guides. Google UI sequence checked against the official consent/client guides linked in the page on 2026-10-14.

The second pass found that `session list` only lists configured profiles, even after logout; it does not verify a current Google session. The corrected guide states this and uses the completed login plus first import to verify access. It also separates the source URL placeholder from the search word to replace, and keeps exact keyword search independent of embedding setup. Own-app branding now describes the reader's app rather than telling them to configure WireCat's domains.

## Pass 3: localization and rendered review

| Page / locale | Opening, terms and path | Anchors and optional detail | Result |
| --- | --- | --- | --- |
| Installation / EN | Outcome first; CLI/profile introduced where needed; three numbered stages, options A/B | Legacy anchors kept; own-app disclosure and final return to browser approval | Reviewed: complete prose, task walkthrough, mobile layout and browser/Markdown checks |
| Installation / RU | Same scope, choices and success checks; translated agent request | Same executable fences, literal names and incoming anchors | Reviewed: complete prose, task walkthrough, mobile layout and browser/Markdown checks |
| Installation / ES | Same scope, choices and success checks; translated agent request | Same executable fences, literal names and incoming anchors | Reviewed: complete prose, task walkthrough, mobile layout and browser/Markdown checks |

Browser regression exercises the agent branch's jump to account connection, the three stages, optional setup initially collapsed and then opened, exact custom-client handoff, and HTML/Markdown parity. Local checks and live publication are verified before final handoff. Technical checks supplement the reader walkthrough; they do not by themselves approve prose.

Rendered review found and fixed two portal problems: Markdown discarded the disclosure tags, and adjoining legacy anchors were discarded together. A narrowly allowed disclosure transform now retains native keyboard controls and optional content in Markdown; the alias transform retains adjoining safe IDs. Seven focused parser tests protect allowed content and unsafe HTML handling. Three localized installation tests exercise the agent jump and existing-client deep link, and seven browser smoke cases pass. Desktop and EN/RU/ES mobile pages were inspected (390px, no horizontal overflow); optional setup is initially collapsed.
