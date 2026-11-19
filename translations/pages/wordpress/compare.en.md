---
title: "Compared with other tools"
---

`wordpress` is a command line and an MCP server for a self-hosted WordPress site: posts and pages, tags and
categories, and the users who write. This page puts it next to the other tools that let an AI agent read and write
WordPress, so you can see which one fits your job. The marks for `wordpress` come from its first release, its commands
and its source, checked on 19 November 2026 against WordPress 6.9.4 in Docker, not against a live site. They are
checked again at each release. The marks for the other tools come from their own documentation and source, linked in
the table, checked on 19 November 2026. Nothing was signed in to or tested live, and a tool may do more than its pages
say.

The tools:

- **wordpress**: this tool. Keeps a copy of your posts and pages on your computer, writes drafts on your site, and
  decides for each action what an agent may do. It signs in with an application password.
- **[WP-CLI](https://github.com/wp-cli/wp-cli)**: the official command line for WordPress, the `wp` command (5,182
  stars). It runs on the server, or on your computer against a server over SSH.
- **[MCP Adapter](https://github.com/WordPress/mcp-adapter)**: the official WordPress plugin that turns the site's
  abilities into MCP tools (1,926 stars). It needs WordPress 6.9 or later, where the Abilities API is part of
  WordPress. What an agent can do depends on the abilities your plugins make public.
- **[WordPress.com MCP](https://developer.wordpress.com/docs/mcp/)**: the MCP server built into WordPress.com. It also
  serves self-hosted sites connected through Jetpack.
- **[claudeus-wp-mcp](https://github.com/deus-h/claudeus-wp-mcp)**: the most starred open-source MCP server that calls
  a site's REST API with an application password (161 stars, changed on 16 March 2026), with 145 tools.
- **[mcp-wp](https://github.com/InstaWP/mcp-wp)**: InstaWP's MCP server over the REST API with application passwords
  (100 stars, changed on 10 September 2026), on npm as `@instawp/mcp-wp`.

WordPress lets a program in through an
[application password](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/), made in
the user's profile on a site served over https. It acts with that user's rights. Every tool on this page except WP-CLI
and WordPress.com MCP signs in this way. Automattic's earlier plugin,
[wordpress-mcp](https://github.com/Automattic/wordpress-mcp/blob/7510accc8460b1b8f568c00860e1cc29e87f1b4f/Readme.md?plain=1#L1-L12),
is archived and points to MCP Adapter and WordPress.com MCP, so it is not in the table. Neither are the plugins that add
their own MCP server to the site, such as EMCP Tools for Elementor.

✅ yes · 🟡 partly · ❌ no · ➖ not in its documentation · n/a cannot apply

## Features

| Task | wordpress | [WP-CLI](https://github.com/wp-cli/wp-cli) | [MCP Adapter](https://github.com/WordPress/mcp-adapter) | [WordPress.com MCP](https://developer.wordpress.com/docs/mcp/) | [claudeus-wp-mcp](https://github.com/deus-h/claudeus-wp-mcp) | [mcp-wp](https://github.com/InstaWP/mcp-wp) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Find and read** | | | | | | |
| Read posts and drafts without the internet | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L16-L20) | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L11) | [❌](https://developer.wordpress.com/docs/mcp/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/config/site-config.ts#L30-L39) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L353-L361) |
| Find a post by the words of its title and text | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L797-L798) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/search/index.ts#L4-L8) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L701-L706) |
| One search over posts and the messages and notes of your other tools | 🟡 | ➖ | ➖ | ➖ | ➖ | ➖ |
| **Write and publish** | | | | | | |
| Write a draft from a Markdown file | ✅ | [🟡](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L137-L142) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12) | [🟡](https://developer.wordpress.com/docs/mcp/tools-reference/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L18-L31) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L728-L742) |
| Publish a draft, or take a post back to a draft | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L395-L396) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12) | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L33-L45) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L676-L681) |
| Schedule a post for a later time | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L159-L161) | ➖ | ➖ | ➖ | ➖ |
| Change a post and keep the blocks Markdown cannot hold | ✅ | n/a | ➖ | ➖ | n/a | [🟡](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L756-L775) |
| A write stops if the post changed on the site since you read it | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ |
| Upload an image or a file | ❌ | [✅](https://github.com/wp-cli/media-command/blob/136c6ea8a5939c2c6760c62554ff07a931340ce1/src/Media_Command.php#L377-L385) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/tools-reference/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/media/index.ts#L19-L38) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L58-L66) |
| **Agents and safety** | | | | | | |
| Let an agent read only | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L97-L102) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Let an agent write drafts but not publish | ✅ | ➖ | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L12-L13) | ➖ | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/content/index.ts#L33-L45) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/tools/unified-content.ts#L676-L681) |
| Choose for each action: allow, ask or refuse | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L97-L102) | ➖ | [🟡](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| A write waits for your confirmation | 🟡 | n/a | ➖ | [🟡](https://developer.wordpress.com/docs/mcp/tools-reference/) | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/security/UserConsentManager.ts#L33-L36) | ➖ |
| The password is kept in the system keyring | ✅ | n/a | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L41-L57) | n/a | [❌](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/readme.md?plain=1#L240-L257) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L353-L361) |
| An agent at a terminal works through commands, without MCP | ✅ | [✅](https://github.com/wp-cli/entity-command/blob/794bc5bbd36e68c36448ab6e6b0aad531bbc358f/src/Post_Command.php#L1000-L1002) | n/a | n/a | n/a | n/a |
| **Setup** | | | | | | |
| Works with nothing installed on the site | ✅ | [🟡](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L16-L20) | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L21) | [🟡](https://developer.wordpress.com/docs/mcp/) | [✅](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/readme.md?plain=1#L240-L257) | [✅](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L13) |
| Works with a WordPress.com site | ❌ | [🟡](https://developer.wordpress.com/docs/developer-tools/wp-cli/) | ➖ | [✅](https://developer.wordpress.com/docs/mcp/) | ➖ | ➖ |
| Several sites, each named in the command | ✅ | [✅](https://github.com/wp-cli/wp-cli/blob/5ec3c05d8b46bb50a6179bc722b97ede35fbd86f/php/config-spec.php#L147-L152) | [🟡](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L41-L57) | [✅](https://developer.wordpress.com/docs/mcp/) | [🟡](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/tools/schemas/common.ts#L10-L14) | [🟡](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/README.md?plain=1#L390-L399) |
| Works from ChatGPT or Claude in the browser | 🟡 | n/a | [❌](https://github.com/WordPress/mcp-adapter/blob/490465b8bca24537204cadafdbec731946e0c26c/docs/getting-started/site-owners.md?plain=1#L81-L83) | [✅](https://wordpress.com/support/mcp/connect-claude/) | [🟡](https://github.com/deus-h/claudeus-wp-mcp/blob/9aa31b4eb84a9325ec46f683e8605a783ce8b0b8/src/index.ts#L109-L120) | [❌](https://github.com/InstaWP/mcp-wp/blob/bd8073ad2d544fd543b81b147ff0cf66be3f104a/src/server.ts#L69-L72) |

| | wordpress | WP-CLI | MCP Adapter | WordPress.com MCP | claudeus-wp-mcp | mcp-wp |
|---|---|---|---|---|---|---|
| Install | npm, Node 22.16+ or 24+ | a PHP file on the server | a plugin on WordPress 6.9+, and `npx` on your computer for most apps | none: built into WordPress.com | npm or `npx`, Node 22+ | `npx`, Node 18+ |
| Licence | Apache-2.0 | MIT | GPL-2.0-or-later | closed service | MIT | GPL-3.0-or-later |
| Price | free | free | free | in every paid WordPress.com plan. Free sites, and Jetpack sites without a Jetpack AI or Complete plan, only until 30 November 2026 | free | free |

Notes on the `wordpress` column:

- **Sign-in.** An application password acts with the rights of the WordPress user who made it. `session start` reads
  it from stdin or a hidden prompt, never from an argument. It is kept with its site in the system keyring, or in a
  private file on a computer without one. See [installation](./installation.md).
- **Without the internet.** `sync` copies posts and pages with every status, the trash too, with their tags,
  categories and users, into the WireCat local store. Text is kept as Markdown. `posts list`, `posts search` and
  `posts show` read this copy, with `--offline` too. Your WordPress role decides how much is copied. An Administrator
  gets everything. An Editor gets every post and page but no users. An Author or Contributor gets part of the posts
  and no pages, and a Contributor sees only their own posts.
- **One search.** The posts sit in the same local store as the messages, notes and meetings of the other WireCat tools
  on the same computer. `posts search` itself finds posts only, so this row is partly.
- **Drafts and publishing.** `posts create` always makes a draft, from a Markdown file or from stdin. `posts publish`
  publishes now, or later with `--at-time`. `posts unpublish` takes a post back to a draft. `posts delete` moves a post
  to the trash, and `--allow-delete` deletes it for good. These commands write posts. A page is read from the copy, and
  is changed only through the `api` group.
- **Read-only.** `WCWP_READ_ONLY=1` refuses every write, whatever the settings say. The `readonly` level does the same
  for one key, such as `posts` or `api`.
- **Allow, ask or refuse.** Each command and each API operation has its key, such as `posts.publish` or
  `api.media-delete`, set to `allow`, `ask`, `readonly` or `deny` in [the settings](./permissions.md).
  `mcp serve --permission` makes a key stricter for one server only. An agent cannot loosen these settings.
- **Confirmation and publishing over MCP.** Every `posts` write is `ask` by default, and `ask` asks at a terminal.
  Over MCP nobody is there to answer, so `ask` lets the agent go ahead, and this row is partly. So by default an agent
  over MCP can publish. `config set permissions.posts.publish deny` keeps publishing yours, and the agent still writes
  drafts. `runs list` shows each write an agent made.
- **The post changed on the site.** Before a write, `wordpress` compares the post with the copy. If someone changed it
  on the site since the last sync, the write stops with `content.conflict`.
- **Blocks.** Galleries, columns, embeds and iframes do not survive a trip through Markdown. `posts update` changes the
  title, the excerpt, the tags and the status of such a post, and keeps its body. Only `--replace-body` writes the body
  anyway.
- **Upload a file.** The `api` group lists media with `api media-list` and changes its details with `api media-update`.
  It takes a request body as JSON only, so it cannot send the file itself.
- **The api group.** `wordpress blog api` runs any of the 150 `wp/v2` operations of WordPress 6.9.4, with the same
  publishing and deleting keys. WordPress's batch route is never offered, since one batch call would run writes past
  their keys.
- **WordPress.com.** Only self-hosted WordPress 5.6 or later over https. WordPress.com sites sign in with OAuth and are
  not supported. The command is `wordpress`, not `wp`, so it lives beside WP-CLI on one computer.
- **ChatGPT or Claude in the browser.** `mcp serve --http` serves the tool behind a tunnel that you set up and keep
  running yourself, so this row is partly.

## When another tool fits better

- **WP-CLI**: you have a shell on the server and run the site itself: plugins, themes, users, the database, imports of
  media files. It also works on a WordPress.com site with a paid plan.
- **MCP Adapter**: your plugins offer abilities you want an agent to use, and you prefer the connection to live on the
  site. Claude Code reaches it over HTTP with no program of its own on your computer.
- **WordPress.com MCP**: your site is on WordPress.com, or you want ChatGPT or Claude in the browser with nothing to
  run on your computer.
- **mcp-wp** or **claudeus-wp-mcp**: the agent should upload images, answer comments or change menus and plugins
  over MCP, with one tool for each job.

If `wordpress` fits, start with [installation](./installation.md). To use it with an agent, see [usage](./usage.md).
