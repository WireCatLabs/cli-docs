# Security release documentation

Use this review to verify the portal's MAX and Telegram release references and reproduce the changed documentation checks. The checkout starts at cli-docs3bf84b5; other tools retain their reviewed pins.

MAX0.58.0 sourceb471dd3a7fc2cdd2750c9e732069dd22dcbbcb77 and Telegram0.67.0 sourceda792c615555304e2b33126cb8058bb45ff7ed65 use Core0.315.0/Base0.40.2. Actual released package contracts, integrity and hosted publication receipts are checked before merge. Library fixes do not authorize an agent to send account data or imply protection outside these command-line tools.

## Reader review

| Page / locales | Reader task and change | Source and boundary |
| --- | --- | --- |
| MAX commands / ru, en, es | Discover stored Drive links, task-rule application and confirmed addresses; remove unsupported forum/group request flags; use source query filters and comma-separated deletes | Released generated command diff and isolated npm discovery contract; local-write and remote-write labels preserved |
| MAX configuration-reference / ru, en, es | Diagnose an invalid setting without repeating a potentially private value | Released error examples include retry.safe:false; wrong type names the field and further problems are counted |
| MAX search / ru, en, es | Search notes using source:internal/source:file inside the query | Removed --type syntax; account selection remains --source; existing import correction retained |
| MAX troubleshooting / ru, en, es | Recover from an unknown setting using its current error | Updated exact JSON; previous is-not-a-valid-config anchor preserved in every locale |
| MAX changelog / ru, en, es | Understand0.57/0.58 behavior and script changes | Drive search, task rules, diagnostic errors, compile cache and provider-reference/upload guards; literal examples and source links checked |
| Telegram changelog / en, ru, es | Understand0.67 security changes | Provider references removed from output/event streams; synthetic protected WhatsApp state files refused, ordinary neighboring files allowed |
| Both roadmaps / all locales | Distinguish plans from released behavior | Native roadmap content unchanged; updated versioned review records retain those plans |

Changed prose and command deltas retain their action boundaries, literal syntax, links and heading structure. Existing task destinations, reader introductions and unrelated corrections stay in place. No new user-facing capability is inferred from a successful scanner. The broader native/translation reviews recorded for the prior release remain historical; this is the bounded release-delta review.

Local lint and30 targeted update/release/localization tests pass. Final tag-based sync, all five isolated registry command contracts, source-matched localization, release-note/roadmap checks and strict documentation checks pass:1349 reference entries, zero gaps/invalid examples,17 task mappings. The144 syntax illustrations needing manual review remain explicitly reported; no blanket runtime claim is inferred. All seven local browser smoke tests pass. MAX release39024703823 and Telegram release39025507396 succeed; both package SRI values, Core0.315 pins and peeled tag commits match the reviewed sources. Hosted PR/build/deployment receipts are recorded separately.
