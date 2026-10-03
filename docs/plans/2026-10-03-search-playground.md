# Interactive search playground

Approved by the owner after reviewing a compact query-builder idea and asking for a current React solution. Implemented in `feat/search-playground` without changing the active shared landing checkout.

The section sits below scenarios and before benefits. One free-form query input offers field/value/operator suggestions, chat/person/date/file shortcuts, editable examples and a copied CLI command. Results come from a fictional 12-message/four-chat Telegram/MAX archive; context preserves qualified source locators. Prepared summary facts appear only when their supporting messages were retrieved. English, Russian and Spanish, light/dark themes and keyboard/mobile behavior are included.

## Library decision

Choose Base UI Autocomplete 1.8.0: free-form input, accessible suggestion behavior and unstyled React primitives compatible with the existing Fumadocs/Base UI stack. [Autocomplete API](https://base-ui.com/react/components/autocomplete), [accessibility](https://base-ui.com/react/overview/accessibility).

React Aria Autocomplete is another current accessible option, but adds a second component stack. CodeMirror 6 and its React wrapper remain current; their editor machinery is more useful for a larger syntax-editing surface than this compact search input. Visual rule-tree builders need a custom Lucene adapter, so their standard Elasticsearch DSL export does not remove our integration work.

## Shared language and scope

`pnpm search:generate` bundles the parser, registry, normalization, date boundaries and bounded NFA from pinned `@leemour/cli-messaging@0.128.0`. A build-time alias resolves only `CliError` to cli-core's pure errors module; no Node code enters the browser bundle. Generated drift verification and input fingerprint prevent an unnoticed dialect fork. Apache/MIT notices ship at `/search-language-notices.txt`.

The demo evaluator supports text/body, author/chat, date, peer kind, attachments and account/provider scope on the sample corpus. Preset/topic fields require a real archive and are explicitly unavailable here; their valid query syntax can still be copied. Results use newest order, UTC dates and two surrounding messages. They are verified against the actual indexed SQLite service, not hand-authored result arrays. The illustrative source messages remain in English; interface copy is localized.

The landing exporter owns the slot and generated locale snapshots. React renders the widget between the two reviewed HTML fragments, including initial results in the server-rendered page. No account connection, message send, read mark, remote search or AI request exists in this widget.

## Validation and publication

Run `pnpm search:check`, lint/typecheck/test, `pnpm test:browser`, static Next build and link checks. Browser checks cover cursor completion, filter shortcuts, exact copied command, context/source provenance, all three locales, mobile overflow, reduced motion, themes and scoped automated AA checks.

The concurrent landing/docs work has landed and this feature is rebased onto it, retaining the scenario selector, time estimate and updated guides. Default sync uses the reviewed MAX v0.23.0/Telegram v0.22.0 refs and passes. Keep this feature in draft for UI review: the new search profile itself is a preview, and production availability of its copied commands/search-guide translations must follow consumer releases. The primary site release-sync check remains intact.
