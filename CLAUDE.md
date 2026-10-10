@AGENTS.md

## Development check budget

Local commits check only staged lint and secrets. There is no pre-push check.
Config integrity, repository lint, Markdown, and secret detection run in PR CI.
The bounded `ci:quick` step adds typechecking for CLI packages or synthetic unit tests for the docs site.
Full tests, coverage, builds, parity, browser and platform suites run for releases,
explicit manual validation, and monthly nonpublishing validation. See the
[shared policy](https://github.com/WireCatLabs/community/blob/main/standards/README.md#ci-and-hooks).
