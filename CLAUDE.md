@AGENTS.md

## Development check budget

Local commits check only staged lint and secrets. There is no pre-push check.
Config integrity, repository lint, Markdown, and secret detection run in PR CI. Full typechecking, tests,
coverage, builds, parity, browser and platform suites run for releases or an
explicit manual validation. See the
[shared policy](https://github.com/WireCatLabs/community/blob/main/standards/README.md#ci-and-hooks).
