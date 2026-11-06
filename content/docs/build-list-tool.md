---
title: "List your tool in WireCat"
description: "Put a command-line tool you made into the Community tools group on wirecat.dev and into WireCat Desktop: what it needs, the pull request, the review, updates and removal."
---

You built a command-line tool, and you want other people to find it next to the WireCat tools. This page is for
makers outside WireCatLabs. It shows what your tool needs, how to ask for a listing, what we check, and what happens
after we merge it. A listed tool appears on wirecat.dev in the "Community tools" group, and in WireCat Desktop for
people who turn community tools on.

A listing does not make your tool part of WireCat. It keeps your own name, your npm scope and your repository. You
keep making and releasing it.

## Who can list a tool

WireCat tools read people's messages, mail and files. So we do not list tools from anyone who asks. Tools come from
approved publishers, who apply or are invited, and each listing needs proof that our checks passed on the tool and a
maintainer's approval last. The application process is not open yet. To ask, open an issue in
[cli-docs](https://github.com/WireCatLabs/cli-docs/issues).

## What your tool needs

- **It is built from the template, or meets the same standard.** Start with
  [Create your CLI](./build-create-cli.md). Every "Done when" check of the
  [New CLI checklist](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/new-cli.md#done-when) passes in
  your tool's own CI.
- **Every command names its profile.** A profile is a name for one of your accounts, such as `personal`. The tool
  never picks an account by itself, and a missing profile is an error that lists the choices. This applies to every
  command, example, help text and page.
- **Its repository is public.** npm makes no provenance record for a package built in a private repository, and we
  cannot review code we cannot read. A tool from a private repository can only be added on your own computer, as an
  unchecked tool.
- **It publishes to npm from GitHub Actions with trusted publishing.** The release runs from `release.yml` in the
  tool's own repository, on the `main` branch. WireCat Desktop checks the npm provenance of each release, which is a
  signed record of where npm built the package. It refuses a release whose record does not point at that workflow in
  your repository. The template sets this up for you.
- **Planned: it publishes through our release workflow.** Your `release.yml` will call a pinned version of a
  WireCatLabs workflow that runs our standards checks and then publishes. The provenance record then names our
  workflow as the one that built the package, so anyone can see that our checks passed on that release.
- **It has its own name.** Publish under your own npm scope, such as `@example/acme-cli`. The `@wirecat` scope and the
  name "WireCat" stay ours. Do not take a name WireCat reserves for its tools, such as `tg`, `max` or `mail`.
- **It has a release tag and pages.** A tag `vX.Y.Z` that matches an npm version, and at that tag a `docs` folder with
  your pages and a `meta.json` that lists them. The site copies the pages from there.

## Ask for a listing

1. **Release the version you want listed.** Tag it `vX.Y.Z` and let `release.yml` publish it.
2. **Open a pull request to [cli-docs](https://github.com/WireCatLabs/cli-docs).** Add your tool to `tools.json`
   with `"community": true`. Also add its name to `content/docs/meta.json`, `meta.ru.json` and `meta.es.json`.
3. **Add translations if they are missing.** The site has English, Russian and Spanish. Pages in the other two
   languages go into `translations/<name>/` in cli-docs, and `pnpm docs:translation accept` records them.
4. **Link the evidence in the pull request.** The green CI run on the tagged commit, and the result of the fresh
   agent audit that the New CLI checklist describes.

This is a full entry for a tool named `acme`:

```json
{
  "name": "acme",
  "displayName": "Acme Notes",
  "repo": "example/acme-cli",
  "package": "@example/acme-cli",
  "lang": "en",
  "summary": {
    "en": "Your Acme notes on your computer, searchable offline.",
    "ru": "Ваши заметки Acme на вашем компьютере, с поиском без сети.",
    "es": "Tus notas de Acme en tu ordenador, con búsqueda sin conexión."
  },
  "docsRef": "v1.0.0",
  "community": true,
  "desktop": {
    "tagline": "Acme notes, searchable with your WireCat data",
    "bin": "acme",
    "profiles": { "args": ["profile", "list", "--json", "--no-record"], "shape": "items" },
    "doctor": ["{profile}", "doctor", "--json", "--record"],
    "runs": null,
    "search": null,
    "setup": ["{profile}", "setup"],
    "signIn": { "gives": "your Acme notes", "asks": "an Acme API token", "guide": "https://example.com/acme/token" },
    "skill": null,
    "mcp": null,
    "mcpServer": null,
    "tasks": null,
    "sync": null,
    "storeInfo": null,
    "storeTables": null,
    "storeTableSizes": null,
    "storeCheck": null,
    "storeBackup": null,
    "storeBackupEncrypted": null,
    "storage": { "app": "acme-cli", "env": "ACME" },
    "settings": null
  }
}
```

The fields:

- **`name`** is the command people type. For the desktop app it is 2 to 16 lowercase letters.
- **`repo`** is `owner/name` on GitHub, outside WireCatLabs. **`package`** is the scoped npm name.
- **`lang`** is the language your pages are written in. **`summary`** is one line in each of the three languages.
- **`docsRef`** is the release tag the site copies your pages from.
- **`desktop`** is what WireCat Desktop needs to install, check and sign in your tool. Leave it out to list the tool
  on the site only. `tagline` is at most 55 characters. `bin` is the program npm installs. `storage` is the folder
  name and the environment prefix your tool passes to cli-base's `resolvePaths`. Write `null` for a command your tool
  does not have.
- **Every list holds plain command words.** Letters, digits and `._:=,/+@-`, at most two leading dashes, and slots such
  as `{profile}`. No spaces, quotes or shell signs.

A community entry cannot set `partOf`, `commandPrefix`, `memory`, `taskBoard`, `bot`, `storeReset`,
`storeResetPreview`, `configRepair` or `signIn.command`. These belong to WireCat's own tools.

## What we check

Checks run in this order. The automated ones come first, and a person approves last.

**Automated, on the pull request:**

- **Built:** the tests in cli-docs run the same entry rules as the desktop app, so a bad `desktop` entry fails the pull
  request.
- **Planned:** the provenance of the release names your repository and, once it exists, our release workflow.
- **Planned:** our standards checks run again on the source at your release tag.
- **Planned:** a scan of the npm package for secrets and malware.
- **Planned:** a fresh agent audits the tool in CI, given only our handbook and your repository.

**A maintainer approves**, following the
[review list for community tools](https://github.com/WireCatLabs/cli-docs/blob/main/docs/REVIEWING.md#community-tools).
Until the planned checks exist, the maintainer checks these by hand:

1. The New CLI checklist is green in your CI, on the tagged commit.
2. The fresh agent audit found no open gap.
3. Every command, example, help text and page names its profile.
4. Nothing uses the `@wirecat` scope or the name "WireCat".
5. On the tagged release, the doctor and setup commands of the entry run as written for a new profile, and every
   other command the entry names exists.
6. The data folder in `storage` belongs to your tool alone.

The review checks how your tool is built and released. It does not check everything your tool does.

## After we merge it

- **The site lists it** in the "Community tools" group, with your pages from the `docsRef` tag.
- **The desktop list is rebuilt.** Each deploy of the site builds the list of community tools for WireCat Desktop and
  signs it. The deploy runs on every merge and once a day.
- **Desktop users see it only when they choose to.** The tool appears after a person turns on "Enable community
  tools" in Settings and restarts the app. It carries a **Community** badge, and before install the note "Made by
  `<owner>`, not by WireCat. The app checks where npm built it, not what it does."
- **Each install is checked.** Before it installs your tool, the app checks that npm built that release from your
  repository's `release.yml` on `main`.

The site already builds and signs the desktop list. WireCat Desktop starts reading it in an upcoming release. Until
then a listed tool appears on the site only.

## Updates

- **New releases** reach desktop users through npm. Each one passes the same provenance check before the app
  installs it.
- **Pages** on the site come from the `docsRef` tag. A daily check opens an issue in cli-docs when a newer release
  exists. A pull request that moves `docsRef` to the new tag updates your pages after review. You can open it
  yourself.
- **Changes to the `desktop` entry**, such as a new command, go through a pull request and the same review.

## Removal

We remove a listing when a tool breaks the rules above, or when its maker asks. The entry leaves `tools.json`, and
the next deploy publishes a list without it.

- **On the site** the tool disappears from the "Community tools" group.
- **In the desktop app** the tool is no longer offered once the app has the new list, from the next start. The app
  never uninstalls a copy that a person installed.
- **Planned:** the app shows a removed tool that is still installed as "No longer listed", with an Uninstall button.

## Try it before listing

You can see your tool in WireCat Desktop before anyone reviews it. It then carries a **Not checked** badge.

- **Today, for developers.** Start the app with the environment variable `WIRECAT_EXTRA_TOOLS=1`, and put your entry
  in the file `extra-tools.json` in the app's data folder. The app checks the entry with the same rules and shows
  every refusal in its console. The desktop
  [notes on community tools](https://github.com/WireCatLabs/wirecat-desktop/blob/main/docs/dev/cli-registry.md#your-own-tools-not-checked)
  show the file's shape.
- **Planned, for everyone.** Turn on "Allow tools WireCat has not checked" in Settings and confirm the warning. The
  Agents page then has an "Add your own tool" button that takes an npm package name. It warns that the tool gets
  access to all your personal data in WireCat, that you should add it only if you trust its authors completely, and
  that WireCat takes no responsibility. One more confirmation comes before the install.

## Where to go next

1. [Create your CLI](./build-create-cli.md) to start a tool from the template.
2. [Sign in and stay compliant](./build-sign-in.md) for the rules every tool follows.
