# Meeting project discovery review

Readers who found a meeting can compare it with saved projects, inspect the cited evidence and
review possible tags before saving anything. The updated search guide is the task home; usage
links the command, MCP explains the separate catalog grant, and the command reference gives exact
bounds. Existing URLs and anchors remain available.

## Source and scope

Reviewed Zoom `v0.25.0`, source `55956cc2c3fe36fed7b6a721c22c28ab19acf091`, with registry
Core0.334.0/Base0.44.1. English search/MCP/usage/command/changelog changes and their ten RU/ES
translations were read. Executable fences stay identical; the new translated headings preserve
English anchors. Other tool pins and homepage/non-documentation browser coverage are unchanged.

| Claim | Owning evidence |
| --- | --- |
| Bounded stored suggestions and citations | Core `src/cli/meeting-project-candidates-read.ts`; Zoom `src/meeting-project-candidates.test.ts` |
| Explicit MCP grant; unknown fields before opening | Zoom `src/mcp-server.ts`, `src/meeting-project-candidates-mcp.ts` and tests |
| Read-only selected account; close before output | Zoom `src/meeting-project-candidates.ts`, installed candidate proof |
| Existing label preflight/audit, aliases and guarded creation | Memo `v0.65.1`, `src/vocabulary/command.ts` and released command contract |
| One scheduled page is SDK-only at this release | Zoom `src/series-inventory.ts`, released command discovery |

Title hints remain distinct from transcript citations. Alias ambiguity survives hidden candidates;
evidence and output coverage have separate continuations. Repeated names/pages do not prove
membership. Memo membership writes use its own proposal preconditions, not the scan's vocabulary
fingerprint. The global project catalog has its own MCP grant. Archive completeness remains unknown.

The label guide reuses existing Memo operations and explicitly avoids claiming automatic merging,
semantic synonym detection or exhaustive uniqueness. No new terminology or navigation was needed.
The roadmap remains broader future preparation: this scan does not yet discover and assemble all
unselected sources. The inventory CLI/MCP draft is not a published capability.

## Evidence and checks

The npm, validated and publish tarballs match SHA-256
`80b59c4370096d370d11a6e7d88f9146d71582b93eeab11b6f3688ad0306e21b`.
Release run `39093783066` passed 522 source cases, the 259-case command matrix with one interactive
exception and zero missing, and six installed Linux/Windows/macOS Node22/24 proofs. The independent
registry-only replay in cli-testing retains citations, rejects raw unknown fields and leaves the
synthetic database unchanged with zero external I/O attempts. These are implementation boundaries,
not an evaluation of an agent's project interpretation.

Structural translation checks pass before fingerprints were accepted. Release-note review,
contracts, strict docs, lint, unit and type gates are run for the portal PR. Production export,
links, SEO and browser gates remain required by deployment; live pages are checked after it passes.
