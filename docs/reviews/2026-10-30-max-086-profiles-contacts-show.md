# MAX 0.86.0 reviewed publication, with `mcp serve --profiles` and `contacts show`

Readers start the MAX MCP server for a named profile, or for several with `--profiles a,b` / `--profiles all`; with
neither, `max mcp serve` refuses and lists the profiles, as tg does. A person's profile is `contacts show`
(`contacts info` is gone), and phone numbers are shown whole, with `--hide-phone` to leave one out. Messages, the inbox
and search hits carry `sender_is_me`. The portal targets published max 0.86.0 (Core 0.478.0). The pin, the max pages
and the shared MCP guide's paragraph about max move in one change. Reviewer: Claude.

## Sources and boundaries

- [max v0.86.0](https://github.com/WireCatLabs/max-cli/releases/tag/v0.86.0), captured by `pnpm sync`. The source
  diff is `git diff v0.84.0 v0.86.0 -- docs CHANGELOG.md` in max-cli.
- The roadmap is unchanged since v0.76.0; none of its planned items shipped.
- max's own `docs/usage.md` still names `contacts info` in its overview table (line 40). A correction in
  `scripts/docs-corrections.json` shows `contacts show` in all three languages until max-cli fixes the source.
- `pnpm docs:quality --strict`: 0 invalid examples.

## Reader-path review

Code fences, CLI literals, link destinations and heading structure were checked with `docs:translation check`.
Changed prose was translated by hand, not accepted from fingerprints.

| Pages | Result and review |
| --- | --- |
| max EN/ES/RU: commands | Technical reference mirrored from the release: `mcp serve`, `mcp revoke`, `mcp server stop|status` and `mcp config` with `--profiles`; `contacts show` with `--hide-phone`, `contacts info` removed; `account show` and `account update` with `--hide-phone`; `sender_is_me` in the returned fields. |
| max EN/ES: mcp | New paragraph: one server for several profiles with `--profiles`, and the refusal without a profile. |
| max EN/ES: people | The person's profile is `contacts show`; `phone` is whole, `--hide-phone` and `--offline`. |
| max EN/ES: usage | `account show` prints the whole number, `--hide-phone` leaves it out; `contacts show` examples. |
| max EN/ES: changelog | Entries 0.85.0 and 0.86.0 translated in the established framing. |
| max EN/ES: bot, cli-contract | Links moved to the v0.86.0 tag. |
| Shared guide EN/RU/ES: mcp | The `--profiles` paragraph now covers tg and max; the sentence that max has no `--profiles` is gone. |

No live MAX action was performed for this publication.
