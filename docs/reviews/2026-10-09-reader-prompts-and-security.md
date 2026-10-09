# Reader prompts and security review

Base: cli-docs main `2ee0abbbb4f2e4c4ff84ea642a184a67ecc6f586`.

Readers opening Getting started can copy five short requests without a prompt header.
Inline example questions use code styling. The capability list puts bots third and group
administration fourth; the browser/mobile guide has a shorter localized title. Shared
prose links use a more saturated blue in light mode and a brighter blue in dark mode.

The security guide now opens with the project's automated and manual security work,
lists its coverage, and explains prompt injection, downloads and dependency/release checks.
Reviewed the complete changed EN/RU/ES pages, the first action and the reporting links.
Keep permissions, agent instructions, host approval and external processing distinct.
Preserve old headings as aliases after replacing assistant with agent.

## Evidence

- cli-testing `5445c6f08b15ee04881aee3cbe466b0a17574b56`,
  `docs/security/METHOD.md`, `RUNBOOK.md` and `LESSONS.md`: automated tools,
  manual checklist, verification of candidates, scope and recording of coverage gaps.
- Local private audit `max-cli/docs_ai/security/runs/2026-10-09/REPORT.md`:
  confirmed scanner/manual work, unresolved findings and incomplete coverage. Used to
  verify that an audit happened, not to claim that all reviewed code passed. Private
  finding details are not copied into public pages.
- Existing reviewed security/permissions guide boundaries retained: local history is
  not encrypted by the tools; unrestricted file/terminal access can change settings;
  app approvals and server permissions are separate; injected text grants no authority.

The public audit-method links use the verified immutable cli-testing commit under
WireCatLabs. No release pin, generated messenger guide or audit finding status changed.

## Validation

Local unit, lint, type checks and focused browser checks cover prompt copying, mobile
width, localized headings, axe checks on security pages and Markdown equivalents.
Full export, links, SEO and browser coverage run in CI before publication.

The full CI callout check caught insufficient link/text contrast in light mode.
Adjusted the brighter palette and verified session-recovery callout links in light
and dark mode across all three locales without changing the accessibility assertion.
