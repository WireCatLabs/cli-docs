# WhatsApp 0.17.0 reviewed publication, with `reactions list`

Readers can ask who reacted to a message with `wa <profile> reactions list <chat> <message>`. It reads only the local
store, so it lists the reactions this archive received (history push, `serve`, `watch`). WhatsApp has no request for
older ones, so a reaction sent with `reactions add` or one that arrived while nothing listened is missing. A channel
refuses it. The portal targets published wa 0.17.0. Reviewer: Claude.

## Sources and boundaries

- [wa v0.17.0](https://github.com/WireCatLabs/whatsapp-cli/releases/tag/v0.17.0), captured by `pnpm docs:contracts`.
  The source diff is `git diff v0.10.0 v0.17.0 -- docs CHANGELOG.md` in whatsapp-cli.
- `pnpm docs:quality --strict`: 0 invalid examples.
- The roadmap is unchanged; storing the reactions you send stays planned.

## Translations

RU and ES of 15 pages (archive, bot, changelog, cli-contract, commands, configuration-reference, diagnostics, limits,
mcp, people, query-language, recipes, remote, sessions, usage) were updated by hand against the English diff and
accepted after `pnpm docs:translation check` passed.
