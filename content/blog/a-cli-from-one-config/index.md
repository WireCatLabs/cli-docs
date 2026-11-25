---
title: A CLI for your own service from one config file
description: In a week I taught the WireCat template to build a whole CLI from one file, wirecat.config.ts. That's how attio, linear and wordpress came out in 3 days, with a sync into a local copy, an MCP server and tests. Here's how much code was hand-written, what broke on a real WordPress, and whether it fits your CRM.
date: 2026-11-21
tags: [cli, ai-agents, mcp]
cover: ./cover.jpg
coverAlt: "A small card on a dark table, with glowing violet threads running from it to a big finished console with toggle switches, little filing drawers and a small padlock on one switch"
author: viacheslav-ptsarev
glance:
  - value: "0 lines"
    label: "of hooks in linear and wordpress, the whole source is in the config"
    href: "#3-clis-in-3-days"
  - value: "42 lines"
    label: "hand-written in attio after new, while hubspot, built without a config, has 2,340 but also does much more"
    href: "#3-clis-in-3-days"
  - value: "1 h 55 min"
    label: "of the 2 h 54 min linear build went into fixing the shared packages, not the config"
    href: "#where-the-time-went-not-the-config"
draft: false
---

I made it possible to build a new WireCat CLI from one file. You write `wirecat.config.ts` - what the service is, where its API description lives, how to check a token, and which fields in its responses are people, companies and deals. Then one command, `new --from-config`, makes a CLI with a sync into a local copy, an MCP server and tests for its category. There are 3 categories so far: CRM, issue tracker and content (posts on a site), and the API description can be OpenAPI, a GraphQL schema or the `wp-json` index of a WordPress site.

I'm writing this mostly for people whose company has its own CRM or helpdesk and who want their agent to work with it the way it works with mail and chats in WireCat. Let me say up front where the limit is: a CRM from a config only reads for now, and a helpdesk that has only a REST API doesn't fit any category yet (more on that at the end).

3 real CLIs are already built on the config - attio, linear and wordpress. Agents built them from the template, and I answered their questions, decided what to fix and read the reviews. So the times in the tables below are agent time, not mine.

Before this the template ([cli-template](https://github.com/WireCatLabs/cli-template)) already had `new --spec-url`: you give it the address of an API description and get one command per operation. From PokeAPI's description that's 102 commands, a real response and a working MCP server in 16 seconds, not counting the time npx takes to download the template itself. But that's only live API calls. For an agent to search a CRM fast you need a local copy, a sync of only the changes, and people linked to the rest of WireCat's sources. Before, all of that was written by hand in every CLI.

Now it's all described in the config. Here's an example for a made-up CRM:

```ts
import { defineCli } from "@wirecat/cli-core/manifest"

export default defineCli({
  identity: { command: "acme", package: "@acme/acme-cli", prefix: "ACME", service: "Acme CRM", owner: "acme" },
  spec: { kind: "openapi", from: "https://crm.acme.example/openapi.json" },
  auth: { preset: "token", verify: { operation: "getMe", id: "workspace.id", name: "workspace.name" } },
  category: "crm",
  source: {
    provider: "acme",
    kinds: ["person"],
    entities: {
      person: {
        list: { operation: "listContacts", query: { limit: 100 } },
        changes: { operation: "listContacts", query: { limit: 100, updated_since: "{since}" }, since: "iso" },
        get: { operation: "getContact", path: { id: "{id}" } },
        map: { externalId: "id", name: "full_name", emails: { each: "emails", value: "address" } },
      },
    },
  },
})
```

```sh
npx @wirecat/cli-template new --from-config wirecat.config.ts
cd acme-cli && pnpm install && pnpm generate
node dist/bin/acme.js work session start    # takes the token and checks it with the auth.verify operation
node dist/bin/acme.js work sync             # copies the records in, then only what changed
```

`work` here is a profile name, you pick it yourself, and the CLI never takes an account by default. Without `changes` the sync still works, it just reads the whole list every time. `pnpm source:check` checks that every operation and every path in `map` really exists in the generated API, so a typo in `full_name` shows up before the first sync. Paging, cursors and the local database the copy goes into come from cli-core, the shared package of all WireCat tools. What the config can't describe (say, the service keeps old values of a field next to the current one) goes into `src/hooks.ts`.

Plus you get tests right away. Every API operation is sent to a fake - a pretend server inside the test, built from the API description. It's strict, so it refuses any request the description doesn't allow. And the source runs through the category's contracts, a shared set of tests that checks every CRM in WireCat the same way. There are cases like "the list broke off after its first page, the next run goes on from that page, nothing lost or repeated".

## 3 CLIs in 3 days

`--from-config` itself came out on Nov 17 and at first could only do CRM. Right after that agents started building real CLIs on it, each one found gaps, and those were fixed in the template rather than in the CLI. In 4 days the template went from one CRM to 3 categories, and by Nov 21 (version 0.33.0) WordPress builds from the site's full index.

All 3 CLIs have `wirecat.config.ts` in their very first commit:

| | [attio-cli](https://github.com/WireCatLabs/attio-cli) | [linear-cli](https://github.com/WireCatLabs/linear-cli) | [wordpress-cli](https://github.com/WireCatLabs/wordpress-cli) |
| --- | --- | --- | --- |
| What it is | CRM, OpenAPI | tracker, GraphQL | content, `wp-json` |
| Template | 0.28.0 | 0.31.0 | 0.32.0 |
| Config lines | 64 | 102 | 117 |
| Hook lines | 23 | 0 | 0 |
| Hand-written code after `new`, hooks included | 42 | 7 | 81 |
| Generated | 107 operations | 493 operations | 147 operations |
| From `new` to a green `cli-dev ready`, without the live check | about 2 h 40 min | 2 h 54 min | about 40 min |
| First release | Nov 18 | Nov 19 | Nov 19 |

`cli-dev ready` is a command that runs every check before a release (lint, tests, contracts, docs and so on) and says for each one whether it passed. The live check is a run of the CLI against a real test account of the service, and it isn't in the table.

All numbers are from each CLI's first build, from the measurements in cli-testing ([attio](https://github.com/WireCatLabs/cli-testing/blob/main/performance/generation/source-manifest/README.md), [linear](https://github.com/WireCatLabs/cli-testing/blob/main/performance/generation/linear-from-config/README.md), [wordpress](https://github.com/WireCatLabs/cli-testing/blob/main/performance/generation/wordpress-from-config/README.md)). The configs have grown since. By its first release attio got deals, the config became 126 lines and the hook shrank to 8.

For comparison, [hubspot-cli](https://github.com/WireCatLabs/hubspot-cli) is also made from the template, but before the config, and it has 2,340 hand-written lines, mostly mapping HubSpot's responses to CRM records. You can't get a percentage saving out of this, because hubspot syncs a lot more (deals, leads, activities and so on), and attio's first build synced only people, companies and workspace members. You can see the order of magnitude, there's no exact number.

In wordpress-cli the 81 lines aren't about mapping at all. 10 lines are text the user and Desktop see, and 71 came from the reviews, almost all of them about permission keys.

## What broke on a real WordPress

The template had its own WordPress test case with 19 routes, and a real WordPress 6.9.4 without plugins has 127 in its index.

On the full index `pnpm generate` stopped right away. `GET /wp/v2/block-types/{namespace}` got the same command name as reading one block type, and deleting all of a user's application passwords the same as deleting one. Now they're `block-types-list-namespace` and `users-application-passwords-delete-all`.

The route `wp_pattern_category` broke even more. The generator writes a permission key for every operation, and all the keys live in the CLI's one settings file. The settings check didn't know a key with an underscore, and because of that it wasn't one test that failed but every `api` test, 151 of them. Now the template's CI builds WordPress from the full 6.9.4 index, not from a trimmed sample, so this gets caught right away.

Then an agent ran a live check on WordPress in Docker with 3 test users: a Contributor, an Author and an Editor. The fakes accept any call the API description allows, but a real site refuses by role. An Author and a Contributor can't read tags with `context=edit`, even though a tag's name and slug are public, so the config now reads them without it. WordPress also returns HTTP 400 (with a 403 inside) to these 2 roles on the pages list, and that refusal broke the sync of all posts, and every run after that failed on the same call. Now the pages list needs the `edit_pages` right, without it the call simply isn't sent, and the sync says at the end what was missing.

And a review by a fresh agent found a hole after all the checks were already passing. The `api` group offered a command that creates an application password, and WordPress returns the new password in plain text, while its index doesn't mark that field as secret in any way. So an agent could make a password and get it into the chat. In wordpress-cli this was closed by hand before the first push, and on Nov 21 cli-base started marking that field secret for every WordPress CLI, so those calls are gone from `api`.

The same review found that a deny on `posts create` didn't stop the very same call through `api posts-create`, and that writes that change the whole site (plugins, settings, users) ran without asking. Now the CLI asks first by default.

## Where the time went (not the config)

The config itself took almost no time. An agent wrote attio in 1 h 20 min, then 17 tests failed, and all 17 were bugs in the shared packages, none of them in attio. Fixing them with reviews took about 1 h 20 min more, plus 2 releases.

In linear, about 1 h 55 min of the 2 h 54 min went into the shared packages. `cli-dev ready` didn't know the tracker category, cli-core had no fake to run the tracker contract on a source from a config (that's about 930 lines), and the GraphQL `api` test ran out of memory. Linear's filters nest inside each other (`IssueFilter` reaches `TeamFilter` and back), and the test that tried to fill every optional field built filter inside filter until the worker gave up. Now all 493 Linear operations pass in about 20 seconds.

Before a release, CI wants every command of the CLI and every one of its flags to have at least one test, otherwise `release:check` won't let the version through. After the review linear-cli still had 562 such flags and commands without a test, for example `--body-file` and `--all` in the `api` group, or the tracker commands. Those tests moved into the template, but they covered the tracker and not WordPress, so wordpress-cli hit the same thing with 501 of them. They moved into the template the same day too.

The third CLI came together several times faster than the first two: about 40 minutes to a green `cli-dev ready`, against 2 h 40 min for attio and 2 h 54 min for linear. The release commit for wordpress, with 2 reviews and the live check, came 1 h 20 min after `new`.

## What these numbers don't show

- Linear on a real workspace in the measurement itself: there the config was checked against the schema and a fake built from it, the live check passed later, before the first release.
- A real WordPress site with plugins, caching or a security layer that hides routes. All live checks ran on 6.9.4 in Docker.
- Attio deals on real data. The test workspace has none, so the deal mapping was checked against the fake only.
- Human time. I didn't time myself, all I know is that I answered the agents 3 questions for attio, 1 for linear and none for wordpress.
- An exact comparison between the CLIs. Attio's numbers come from a different line counter than linear's and wordpress's, and the scope differs for each, so the table above shows the rough scale.

## If you have your own CRM or helpdesk

What you need to get it running:

- An API description - OpenAPI 3 or Swagger 2.0, in JSON or YAML, and for a tracker a GraphQL schema (`new` gets it by introspection). If the description is wrong in places, a patch with its reason goes into `scripts/spec-model.ts`. If a list has no paging described, the contract test fails on purpose until you describe it.
- A token sign-in and an operation that reads who you are with that token (`auth.verify`), because the local copy is kept under that account. If different users of your service see different records, I'd keep a separate copy for each user instead of one per workspace. In linear a review caught exactly this: one member's sync could mark someone else's private issues as deleted.
- A test account. The build and every check before the live one run against the fake, but for the live check and for real work `session start` checks the token against the real service.

It doesn't fit everyone yet. As of Nov 21 a CRM built from a config is read-only (sync, lists, search in the copy), and write commands to the CRM are hand-written. `new` refuses a tracker over OpenAPI, because cli-core's tracker fake only answers GraphQL for now. So a helpdesk with only a REST API doesn't fit any config category right now, and what's left for it is `new --spec-url` with live calls, or writing the source yourself. OAuth can't come from the config yet either, you wire it up with cli-core's `oauth` module. And all of this is Node and TypeScript only.

Before connecting an agent I'd check the write permissions. In a terminal every write at the `ask` level asks you, but over MCP there's nobody to answer, so it just runs. That's why `mcp add` won't connect a profile that can write until you add `--allow-writes`, and every write then shows up in `runs list`. If the profile you give the agent must not delete anything in your CRM, set `config set permissions.api readonly`, or `deny` for specific operations. This paragraph is now written into the README of every new CLI with an `api` group.

If the CLI won't be part of WireCat, `package` gets your own scope and `owner` your name, and how to set up the repository and publishing to npm is in [Publishing outside WireCat](https://github.com/WireCatLabs/cli-template/blob/main/kit/README.md#publishing-outside-wirecat). Every field of `wirecat.config.ts` is in the [kit reference](https://github.com/WireCatLabs/cli-template/blob/main/kit/README.md#new-name), and how to build your own tool with the template and an agent and connect it to WireCat is [in the docs](/en/docs/build-create-cli).

Ghost is next on the plan, the second content CLI after WordPress. To start with your own CRM, take the example above, put in your description's address, your operations and your paths in `map`, and run `npx @wirecat/cli-template new --from-config wirecat.config.ts`.
