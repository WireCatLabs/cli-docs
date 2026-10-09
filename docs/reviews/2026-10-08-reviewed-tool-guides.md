# Reviewed Telegram and MAX guide update — 2026-10-08

This completes the guide follow-up to [archive preparation](../plans/2026-10-08-archive-preparation.md).
The website now reviews Telegram v0.35.0 and MAX v0.34.0 in English, Russian and Spanish.

## Source boundary

Work started from clean origin/main `f5ad67f23e9ef4df3d89e3a5a3b909fee13422ef` in an isolated
worktree. The owner's active landing worktree was preserved.

| Tool | Previous reviewed tag | New tag | Release source commit | Messaging dependency |
|---|---|---|---|---|
| Telegram | v0.28.0 | [v0.35.0](https://github.com/WireCatLabs/tg-cli/releases/tag/v0.35.0) | `25a63521663be3fb8d81bbc542d0244f97d53b25` | 0.177.0 |
| MAX | v0.29.0 | [v0.34.0](https://github.com/WireCatLabs/max-cli/releases/tag/v0.34.0) | `f35530e8db73f0e5d01cd9b753b991e763377cf1` | 0.176.0 |

Both releases use cli-core 0.17.2. GitHub tags, npm versions and published provenance were verified
in the consumer release work. Installed command contracts were captured again from the exact npm
versions in temporary directories with network and keyring sockets disabled; no owner session was used.

## Review scope

All 29 Telegram and 31 MAX release pages, including start pages and changelogs, are represented in
three locales. The update installs 117 reviewed translation overlays plus six curated start pages.
Changed prose was deduplicated into 1,493 source units with 2,894 locale targets. Every target received
source-based editorial review; unchanged source-matched translation blocks were retained.
Local Argos/CTranslate2 drafts were provisional and extensively corrected, including reversed
negations, actors, read-state changes, permission precedence and upper/lower bounds. Drafting models,
review JSON and temporary tooling are local ignored artifacts, not deployed assets.

New reference descriptions cover all eleven added page types, and start-page links use only routes
present in each tool’s release. Telegram’s file/audio tasks lead to usage; its model tasks lead to
the configuration reference. MAX has dedicated attachment, audio and external-model pages.

The reviews covered search defaults and coverage, bounded archive preparation, permission and profile
rules, current three-tool MCP surfaces, CLI envelopes and retries, contacts/notes, ranking evidence,
attachments, local speech recognition and optional external model APIs. Native-language source pages
were checked against the same release contracts and retained portal errata. Russian addresses the
reader as «вы»; Spanish uses «tú». Commands, examples, URLs and original heading anchors are preserved.

The generated Telegram Bot API appendix keeps the release's English schema descriptions, explicitly
labeled and marked `lang="en"` in Russian and Spanish. This preserves the existing owner-approved policy.
The surrounding bot guide and command reference are localized.

## Portal errata

The exact correction set was reviewed with the new sources. Existing beginner login/path/archive
explanations, harness-neutral setup, QR reconnection, send-status shell handling, scheduled-send hour
accounting, moderation boundaries and the public my.telegram.org screenshot remain applicable.
The older configuration introductions and developer-mode link correction are retired because the
released guides replace those sections; current OpenAI plugin links were checked against the
[official quickstart](https://developers.openai.com/plugins/quickstart) and
[authentication guide](https://developers.openai.com/plugins/build/auth).

Additional delivered corrections address immutable release-tag inconsistencies:

- Telegram already used `--backend both` in v0.34.0. Its v0.35.0 guide corrections did not introduce
  that default. Historical notes now reflect the released command descriptor.
- Join-request name/link filtering shipped in Telegram v0.35.0, so it is removed from future work and
  mapped to `--search` / `--link`. Folder rules remain future for that released Telegram adapter.
- Bulk decline does not consume the hourly sending allowance; bulk acceptance does.
- MAX folder ordering keeps All chats first and appends omitted folders in their prior relative order.
- MAX's default lack of send confirmation is qualified by per-command permissions.
- Telegram registration estimates use the released table ending August 2026; topic repeat safety is
  limited to edits and ordering, with inspection required after an unknown creation result.

A localization regression check now covers a reviewed native-language overlay of a generated
foreign-language reference. Errata apply to the selected overlay after preservation validation,
rather than prematurely to the generated source in the tool's nominal language.

## Validation

Passed locally: reviewed-release sync, per-locale fingerprints and preservation, lint, 209 unit
tests, search bundle checks, type checking, static build, HTML/Markdown links, SEO and all 83
production browser tests. All 180 localized HTML/Markdown guide pairs carry the reviewed version. Offline contract inspection covers all 856 published command reference
entries without missing commands or options. The temporary parser flagged 45 localized syntax illustrations/heredocs and 105 cases requiring
manual review. These reduce to command alternatives, profile placeholders, shell policy patterns,
quoted search wildcards and stdin examples; their concrete commands were checked against the
contract. They were not executed as messenger commands.

No live messenger action was performed for this documentation update. Publication and live website
verification are tracked in [website PR #72](https://github.com/WireCatLabs/cli-docs/pull/72) and the
[deployment workflow](https://github.com/WireCatLabs/cli-docs/actions/workflows/deploy.yml).
