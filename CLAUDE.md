@AGENTS.md

## Development check budget

The shared rules for hooks and CI are in the [CI page](https://github.com/WireCatLabs/cli-base/blob/main/docs/standards/ci.md) of the WireCat CLI standards
handbook. For this site: commits check only staged lint and secrets, and there is no push hook. A pull
request runs config integrity, lint, Markdown lint, the secret scan and `ci:quick` (the unit tests without
the one that needs generated pages). Full tests, the export, link, SEO and browser suites run in the
deployment workflow on each merge to `main` and daily, and in the monthly full validation.
How long each check takes is in [community's check guide](https://github.com/WireCatLabs/community/blob/main/standards/CHECKS.md).
