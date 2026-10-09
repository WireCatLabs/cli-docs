# Four conversational hero treatments

Four new variants of the selected Outcomes homepage: `/bubbles`, `/assistant`, `/messenger`, `/thread`. Preserve existing variants at4325–4328. No role legend, no system-like Agent response labels. Tool calls are folded into a quiet activity disclosure; commands/JSON remain available. Agent prose is rewritten naturally while retaining the reviewed context/search/commitments scenario facts. Copy requests remain usable with the selected tg/max tool.

```sh
node design/homepage-chat-treatments/build.mjs
node design/homepage-chat-treatments/serve.mjs 4329
```

The responding speaker is the user's existing AI agent, using WireCat tools. A messenger-style contact header illustrates this workflow; it is not a separate hosted WireCat assistant. Public setup/footer links and other selected page blocks remain intact.

The selected `/bubbles` page now shows one command by default, expandable remaining calls and an animated continuation arrow. `/features` is the new plain-language feature page. `/examples` has a scenario sidebar and matching chat design, with a task selector on mobile. Homepage and footer link both pages. The repeated lower example strip is removed. See REFINEMENT.md for this iteration's scope.

Brand icon provenance: Obsidian SVG from Simple Icons via https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/obsidian.svg (downloaded 2026-10-08). GitHub mark uses its standard silhouette; Telegram destinations use the existing Telegram icon. Review captures live under `.impeccable/review/chat-refinement` at repository root.

Second iteration: `/feature-variants` compares `/features-library`, `/features-context` and `/features-day`; none uses chat bubbles. `/bubbles` has four scenarios, three exchanges per scenario, more prominent continuation circles, and command-only disclosure with the real remaining-call count beside the first command. `/examples` adds explanatory introductory copy. Email and Markdown/Obsidian inventory entries have no outbound links. `/archive` restores the original six concepts. See ITERATION-2.md.

Third iteration: `/features-compact` compares `/features-roles`, `/features-chapters`, `/features-compare`. `/refinement-options` compares three command surfaces and useful closing panels. Complete paired homepages: `/home-access`, `/home-connect`, `/home-notes`. Arrow pulses continuously while visible (except reduced motion); both follow-ups include read-only tool blocks. Browse all examples removed. See ITERATION-3.md.

Fourth iteration: `/landing` (also `/bubbles`) applies Checked list, the large three-role switch, nine production reason categories with purple icons and calculator before CTA. Compare all nine outcome/closing combinations in `/studio`. `/all-designs` lists67 verified links; `/block-library` preserves33 component and feature ideas. These private pages remain in the local design directory, outside the public app build. Search uses the existing parser with fictional sample messages. See ITERATION-4.md.

Current compact compositions (iteration five):

- http://127.0.0.1:4329/iteration-five — three complete compositions.
- http://127.0.0.1:4329/landing-editorial — open role lists and compact bubbles.
- http://127.0.0.1:4329/landing-workspace — role chooser and open agent response.
- http://127.0.0.1:4329/landing-folds — expandable role rows and a continuous conversation.
- http://127.0.0.1:4329/block-library — full-width sections, hero details and retained earlier blocks.

Complete durable local URL inventory: [DESIGN-LINKS.md](./DESIGN-LINKS.md). The earlier current page is preserved at http://127.0.0.1:4329/history/landing-before-visual-rework.html. All routes remain private, outside the production application build.
