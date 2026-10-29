# Telegram 0.106.0 reviewed publication, with `reactions list`

Readers can ask who reacted to a message with `tg <profile> reactions list <chat> <message>`. It reads only, so a
read-only profile and MCP can use it. It is refused in a channel and in a chat that hides the list, with the reason in
the error. A person's profile is now `contacts show` (`contacts info` is gone), and phone numbers are shown whole, with
`--hide-phone` to leave one out. The portal targets published tg 0.106.0. The pin and the strict example check for
`reactions list` move in one change. Reviewer: Claude.

## Sources and boundaries

- [tg v0.106.0](https://github.com/WireCatLabs/tg-cli/releases/tag/v0.106.0), captured by `pnpm docs:contracts`
  (isolated home, network and keyring sockets blocked). The source diff is `git diff v0.104.0 v0.106.0 -- docs
  CHANGELOG.md` in tg-cli.
- `pnpm docs:quality --strict`: 0 invalid examples, so the `reactions list` examples match the contract.
- The roadmap is unchanged since v0.92.0; none of its planned items shipped.

## Reader-path review

Code fences, CLI literals, link destinations and heading structure were checked with `docs:translation check`.
Changed prose was translated by hand, not accepted from fingerprints.

| Pages | Result and review |
| --- | --- |
| tg RU/ES: commands | Technical reference mirrored from the release: `reactions list`, `contacts show` with `--hide-phone`, `contacts info` removed, `account show` and `account update` with `--hide-phone`, `sender_is_me` fields. |
| tg RU/ES: people | The person's profile is `contacts show`; the example shows `description` and the whole phone; `--offline` and `--with-notes`; the `phone` note says the number is not masked in the terminal or over MCP. |
| tg RU/ES: usage | `reactions list` example and the channel and hidden-list refusals; `account show --hide-phone`; a shared contact card prints name and phone and is kept in the store. |
| tg RU/ES: changelog | Entries 0.105.0 and 0.106.0 translated in the established framing. |
| tg RU/ES: cli-contract | The architecture link moved to the v0.106.0 tag. |

No live Telegram action was performed for this publication.
