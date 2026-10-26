# Drive 0.41.0 reviewed publication

Readers can keep drive's HTTP MCP server running after its window closes: `drive <profile> mcp server start|stop|status`
starts it in the background and shows the connector address and login code. The configuration page names
`record_input`, because a kept run now holds the command as typed with secrets hidden, and `skill install --for hermes`
is in the command reference. The portal targets published Drive 0.41.0 (covering 0.39.0 and 0.40.0), Core 0.446.0 and
Base 0.59.0. Reviewer: Claude.

## Sources and boundaries

- [Published 0.41.0](https://github.com/WireCatLabs/drive-cli/releases/tag/v0.41.0), commit `ad6dc85`,
  [publication](https://github.com/WireCatLabs/drive-cli/actions/runs/40391539063); 0.40.0 at `3a55e7e`,
  [publication](https://github.com/WireCatLabs/drive-cli/actions/runs/40328755568); 0.39.0 at `688a1ee`,
  [publication](https://github.com/WireCatLabs/drive-cli/actions/runs/40248413170).
- Changes: `mcp server start|stop|status` ([PR 253](https://github.com/WireCatLabs/drive-cli/pull/253)), the typed
  command in a run record ([PR 250](https://github.com/WireCatLabs/drive-cli/pull/250),
  [PR 255](https://github.com/WireCatLabs/drive-cli/pull/255)), the sign-in page as an `open_url` line
  ([PR 251](https://github.com/WireCatLabs/drive-cli/pull/251)), and cli-core 0.437.0 / cli-base 0.59.0 with
  `skill install --for hermes` ([PR 245](https://github.com/WireCatLabs/drive-cli/pull/245)).
- `npm view` names cli-core 0.435.0 / cli-base 0.57.1 for 0.39.0, cli-core 0.437.0 / cli-base 0.59.0 for 0.40.0 and
  cli-core 0.446.0 / cli-base 0.59.0 for 0.41.0. `pnpm docs:contracts` captured the 0.41.0 command contract with the
  network disabled.

## Behavior checked on the released package

`pnpm docs:cli drive …` on the captured 0.41.0 install, with a temporary home and the network disabled:

- `drive --version` printed `0.41.0`.
- `drive personal mcp server --help` lists `start`, `stop` and `status` with the descriptions in the regenerated
  reference.
- `drive personal mcp server status --json` exited 0 with `running: false` and no clients on an empty home.
- `drive commands info mcp server start` declares effects `remote: none`, `local: write`.
- `drive skill install --help` names OpenClaw and `--for hermes`; `drive runs --help` shows no profile.

Not checked: starting a server behind a tunnel, a run record of a typed secret, Hermes, and Windows.

## Reader-path review

Each row covers EN/RU/ES.

| Pages | Result and review |
| --- | --- |
| commands | Reference regenerated from 0.41.0: `mcp server start/stop/status`, `record_input` among `config set` keys, the new `--record` text, `skill install --for hermes`, and `drive upgrade --check` as the only upgrade example. Command text keeps the tool's help language in RU/ES, as before. |
| configuration | `record_input` row added; the `--record` row says the run keeps the command as typed with secrets hidden; `config show` examples run without a profile. |
| installation | `session list` example runs without a profile. |
| remote | New paragraph on running the server in the background with `mcp server start/stop/status`; the code block stays in the source language. |
| roadmap | Unchanged since 0.38.0; plans unchanged. |
| changelog | 0.39.0, 0.40.0 and 0.41.0 entries added in their source language. |
| remaining guides | Unchanged by 0.39.0 to 0.41.0; their source fingerprints still match. |

Remaining native issues for drive-cli: `commands info mcp server start` lists the parent `mcp` options (`--tools`,
`--http`, `--revoke`) in its input schema, and `skill install`'s Returns line still names only Claude Code, Codex and
Gemini CLI.

No live Google request or global installation.
