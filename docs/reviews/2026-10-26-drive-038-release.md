# Drive 0.38.0 reviewed publication

Readers can look up the shared store from the command reference: `drive store info` says where the store is, whether
drive can read it and which tools used it, without a profile and without changing anything. The roadmap now lists
front matter in mirrored Markdown as working today, and the configuration page no longer names a release number,
both from drive's own pages. The portal targets published Drive 0.38.0 (covering 0.37.0), Core 0.432.0 and Base
0.57.1. Reviewer: Claude.

## Sources and boundaries

- [Published 0.38.0](https://github.com/WireCatLabs/drive-cli/releases/tag/v0.38.0), commit `fa49c1a`, and
  [successful publication](https://github.com/WireCatLabs/drive-cli/actions/runs/40235701460); 0.37.0 at `f1d5413`,
  [publication](https://github.com/WireCatLabs/drive-cli/actions/runs/40232508110).
- Changes: `drive store info` ([PR 225](https://github.com/WireCatLabs/drive-cli/pull/225)), run recording from
  cli-core 0.430.0 ([PR 234](https://github.com/WireCatLabs/drive-cli/pull/234)), a bare `--version` answered before
  the program loads with cli-core 0.432.0 ([PR 237](https://github.com/WireCatLabs/drive-cli/pull/237)), and the
  native roadmap and configuration fixes ([PR 238](https://github.com/WireCatLabs/drive-cli/pull/238)).
- `npm view` names cli-core 0.430.0 / cli-base 0.57.0 for 0.37.0 and cli-core 0.432.0 / cli-base 0.57.1 for 0.38.0.
  `pnpm docs:contracts` captured the 0.38.0 command contract with the network disabled.

## Behavior checked on the released package

An isolated install of `@wirecat/drive-cli@0.38.0` in a scratch prefix, with `HOME` and the XDG folders pointed at an
empty scratch directory (no config, no Google account, no keyring):

- `drive --version` printed `0.38.0`.
- `drive store info --help` matches the regenerated reference: the same description, `Returns` and example.
- `drive store info --json` ran without a profile and exited 0; with no store it returned `exists: false` and
  `schema.reason: "missing"` with an `upgrade` object, and created no store file.
- `drive commands info store info` declares effects `remote: none`, `local: read`.
- A run of `drive --record store info` appeared in `drive runs list --json` with no `profile` key.

Not checked: the fields of an existing store (`clients`, `rows`, `by_provider`; needs a store written after a sign-in),
the module-count and start-up figures, and Windows.

## Reader-path review

Each row covers EN/RU/ES.

| Pages | Result and review |
| --- | --- |
| commands | Reference regenerated from 0.38.0: the `store` group covers the shared store, and `store info` is added with its returns and example. Command text keeps the tool's help language in RU/ES, as before. |
| configuration | "Keep the file private" says "an older drive" natively (drive-cli PR 238); the portal correction that did this is retired. RU/ES carry the same wording the correction used. |
| roadmap | Front matter in mirrored Markdown left Next and joined "What works today" natively (drive-cli PR 238); the portal correction that removed it is retired. RU/ES add the same sentence. Plans otherwise unchanged. |
| changelog | 0.37.0 and 0.38.0 entries added in their source language. |
| remaining guides | Unchanged by 0.37.0 and 0.38.0; their source fingerprints still match. |

Remaining native issue for drive-cli: `drive store --help` prints `Usage: drive <profile> store`, although
`store info` runs without a profile.

No live Google request or global installation.
