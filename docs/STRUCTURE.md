# How a tool's docs are laid out

Every tool in the portal has the same pages, at the same addresses, in the same sidebar groups. A
reader who knows where something is for `max` knows where it is for `tg`, and so does an agent.
A tool without a page leaves it out; it does not invent a near-synonym.

The pages live in the tool's own repository, in `docs/`. The portal copies them at the tool's
latest release tag ([plan](plans/2026-10-01-portal-v1.md)).

## The pages

One file per page, `docs/<name>.md`. Each page answers one question, and it is opened for a task,
not read in order.

### Start

- `index.md` — what the tool is, who it is for, one minute from install to the first useful
  result, and where to go next. Short: a reader decides here whether to go on.
- `installation.md` — requirements, install, where files go, shell completion, update, removal.

### Guides

- `usage.md` — the tool in daily use: profiles, reading, writing, output for scripts and agents.
- `sessions.md` — login, profiles, where the credentials live, how to forget them.
- `archive.md` — the local copy: what is kept, keeping it current (`serve`, `watch`), search,
  export, how long it lives.
- `mcp.md` — the MCP server for clients without a terminal: connecting, what it can do, what is
  off until turned on.
- `recipes.md` — whole tasks for an agent, each one copyable.
- Pages only one tool has, named after what they cover — today `bot.md`, `groups.md`, `remote.md`
  (max).

### Reference

- `commands.md` — every command, option and exit code. **Generated** from the program, never
  edited by hand.
- `configuration.md` — every setting and environment variable, and the order they are resolved in.

### When something goes wrong

- `diagnostics.md` — what a command did: tracing, recorded runs, and what a record never holds.
- `troubleshooting.md` — by symptom: what is on the screen, and what to do.
- `security.md` — what reaches the disk and the network, and what never does.

### Project

- `changelog` — from `CHANGELOG.md` at the repository root; not a file in `docs/`.
- `roadmap.md` — what is planned, what is not.

## `docs/meta.json` — the sidebar

The tool owns its sidebar. `docs/meta.json` lists its pages in order, grouped as above:

```json
{
  "title": "max",
  "pages": [
    "---Start---", "index", "installation",
    "---Guides---", "usage", "sessions", "archive", "bot", "groups", "mcp", "remote", "recipes",
    "---Reference---", "commands", "configuration",
    "---When something goes wrong---", "diagnostics", "troubleshooting", "security",
    "---Project---", "changelog", "roadmap"
  ]
}
```

The format is Fumadocs' own ([page tree](https://fumadocs.dev/docs/page-conventions)), so the
portal reads it as it is. Adding a page is one pull request in the tool's repository; the portal
does not change.

## Rules a check enforces

- Every page in `meta.json` exists, and every `docs/*.md` is in `meta.json` — nothing is lost or
  orphaned.
- The required pages are present: `index`, `installation`, `usage`, `commands`, `configuration`,
  `troubleshooting`, `security`.
- A page outside the list above is one only that tool has, and is named for its subject.
- `commands.md` is generated and unchanged by hand.
- Each page starts with a single `# heading`, which becomes its title.
- `docs/README.md` stays the index for contributors, and `docs/dev/` stays out of the portal.

## Language

Each tool writes its pages in one language. The portal records which in its own `tools.json`, not
in `meta.json`, whose keys are Fumadocs' and none of ours. The portal shows the pages in every
interface language; translations come later as separate files.
