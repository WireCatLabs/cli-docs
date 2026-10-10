# Security compatibility release review

Prepared against current portal main `85e3a4c1867eb38c511b51f357723dacd8117c9d`, including the deployment security prerequisite. Runtime pins are the registry-confirmed and tagged MAX 0.43.1 and TG 0.44.1. Both select messaging 0.217.1 and core 0.19.3, preserving the older store schema.

The reader can process longer local documents/recordings and use ordinary hidden working folders, VPNs and private download networks. Known credentials, application state, the message store, caller cancellation and finite file/pixel/image budgets remain protected. Long audio still needs more memory and time. External API OCR retains its separate twenty-page limit. MCP returned text exposes controls; writes and ordinary machine JSON preserve originals. No promise covers every proxy configuration: configured transport determines support.

Native guide discrepancies were corrected in the owning MAX/TG release PRs. Independent read-only reviewers inspected the affected native source and translated sections, including their surrounding reader context. The primary reviewer verified the implementation in the published messaging maintenance source: sends/upload, attachments/extract and pdf-preview, speech/ogg-limit, mcp/text, plus MAX download. Overviews have no counterpart to the changed README security bullets; no overview rewrite is needed.

| Pages/locales | Reader task and verified changes | Review scope/result |
| --- | --- | --- |
| MAX attachments, audio-recognition; en/es and native ru | Local PDF text, complete voice recordings, retained OCR/file budgets | Affected paragraphs and source delta reviewed; stale local limits removed |
| MAX bot, usage, search, security; en/es and native ru | Owner files, credential/state guards, HTTP(S) downloads | Affected paragraphs reviewed; known-path policy and normal networking match source |
| MAX remote; en/es and native ru | Remote retained-file transfer and PDF page previews | Affected paragraphs reviewed; raw write strings, protected paths and unchanged image/byte budgets |
| TG attachments, usage; ru/es and native en | Local PDF text and complete voice recordings | Affected paragraphs reviewed; duration/page/timer refusals removed |
| TG bot, search, security; ru/es and native en | Owner files and directory extraction | Affected paragraphs reviewed; ordinary hidden folders work, protected paths remain |
| TG remote; ru/es and native en | MCP text and retained PDF pages | Affected paragraphs reviewed; read visibility differs from original write arguments |
| MAX/TG command references; all locales | Opt-in agent JSON and explicit CLI file override | New flag and changed descriptions match generated references; command paths/anchors preserved |
| MAX/TG changelogs; all locales | Upgrade expectations | New patch entries translated; historical entries remain historical |
| TG troubleshooting; en/ru/es | Correct archive/discovery/offline recovery guidance | Native release now includes the former portal correction; updated translations and retired obsolete corrections |
| MAX usage and troubleshooting; en/ru/es | Distinguish archive discovery from server-backed one-chat search | Usage matches native; troubleshooting uses an explicit reviewed portal correction backed by messaging 0.217.1 source, because its native sentence remains unqualified |
| MAX groups and CLI contracts; translated locales | Follow implementation references | Link-only release-ref changes verified against captured source; reader prose unchanged |
| MAX/TG roadmaps; all locales | Planned rather than shipped work | This compatibility patch ships no roadmap feature; planned items remain |

This is a review of the affected release changes, not a claim that the entire corpus has no editorial issues. Source fingerprints are accepted only after the changed prose and command rows match the released source and structural checks pass. CI export, browser and deployment results are recorded after execution.
