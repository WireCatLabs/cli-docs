# Drive 0.36.0 reviewed publication

Readers can fix a broken drive settings file from the error alone: every problem names the `drive config unset`
command that removes it, `drive doctor` lists them all, and it also shows a settings file or folder other users of
the computer can read, with the `chmod` that fixes it. The portal targets published Drive 0.36.0 (covering 0.35.0),
Core 0.428.0 and Base 0.57.0. Reviewer: Claude.

## Sources and boundaries

- [Published 0.36.0](https://github.com/WireCatLabs/drive-cli/releases/tag/v0.36.0), commit `43b6d7a`, and
  [successful publication](https://github.com/WireCatLabs/drive-cli/actions/runs/40223085449); 0.35.0 at `2e71d32`,
  [publication](https://github.com/WireCatLabs/drive-cli/actions/runs/40219530471).
- Changes: settings refused by name and `config.issues` ([PR 227](https://github.com/WireCatLabs/drive-cli/pull/227)),
  `config unset`, `--dry-run` and profile-free housekeeping help ([PR 230](https://github.com/WireCatLabs/drive-cli/pull/230)),
  faster start ([PR 229](https://github.com/WireCatLabs/drive-cli/pull/229)), config file modes and cli-core 0.428.0 /
  cli-base 0.57.0 ([PR 232](https://github.com/WireCatLabs/drive-cli/pull/232)).
- `npm view @wirecat/drive-cli@0.36.0` names cli-core 0.428.0 and cli-base 0.57.0. `pnpm docs:contracts` captured
  the 0.36.0 command contract with the network disabled.

## Behavior checked on the released package

An isolated install of `@wirecat/drive-cli@0.36.0` in a scratch prefix, with `HOME` and the XDG folders pointed at a
scratch directory and a fictional `config.json` (no Google account, no keyring):

- `drive --version` printed `0.36.0`; `drive config unset --help`, `drive skill show --help` (`--for claude|agents`)
  and `drive skill status --help` match the regenerated reference.
- A file with old setting names (a camelCase key, the old saved default and the old read-only key) and an invalid
  `storage`: `drive doctor --json` listed each under `config.issues` as `unknown_setting` / `invalid_value` with a
  runnable `fix`; `drive personal status` refused with the first problem, its `config unset` and
  "(and 3 more problems — `doctor` lists them all)".
- The same file at `0644` in a `0755` folder: `doctor --json` reported both under `files.problems` with `want`
  `0600` / `0700`, and stderr printed `to make it private: chmod 600 '<path>'` and `chmod 700 '<path>'`.
- `config unset` (profile, top-level key, and `drive config unset --defaults permissions.files` without a profile)
  removed the key and the saved file became `0600`. `config show` on a file with problems printed what loads and
  each problem with its fix. `drive personal --dry-run config set …` returned `dry_run: true`,
  `action_invoked: false` and left the file unchanged.
- `drive personal config show`, `drive personal doctor` and `drive personal session list` still run, so the
  profiled examples on the configuration page and `lib/words.ts` stay valid.
- Front matter: the released cli-core `markdownBlocks`, which `mirror-docs.js` uses for a local Markdown file,
  returned only the heading and paragraph for a file that starts with YAML front matter.

Not checked: that drive creates a new config folder as `0700` (needs a first sign-in), the start-up speed figures,
and Windows.

## Reader-path review

Each row covers EN/RU/ES.

| Pages | Result and review |
| --- | --- |
| configuration | Removed the camelCase-migration and old read-only paragraphs and the saved-default sentence. Added `config unset`, "Fix a problem in the file" (`config.issues`, the `fix` command) and "Keep the file private" (`0600`/`0700`, `files.problems`, `chmod`). Correction replaces the native release number with "an older drive". |
| troubleshooting | "Not sure what is set up" row names settings problems with their fix and the `chmod` for a readable file; "Name a profile" no longer mentions an old saved default. |
| scenarios | Every account command names the profile, as 0.35.0 ships; the portal's profile correction for `drive mcp` is retired. |
| roadmap | Front matter in mirrored Markdown removed from Next by a portal correction (shipped: drive-cli PR 228, cli-core PR 1952). Native `docs/roadmap.md` still lists it; fix belongs in drive-cli. |
| commands and changelog | Reference regenerated from 0.36.0 (`config unset`, `skill status`, `skill show --for`, profile-free housekeeping examples); 0.35.0 and 0.36.0 entries added in their source language. |
| remaining guides | Unchanged by 0.35.0 and 0.36.0. |

No live Google request or global installation.
