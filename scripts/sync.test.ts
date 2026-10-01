import { describe, expect, it } from "vitest"
import { latestTag, toPage } from "./sync.ts"

describe("latestTag", () => {
  it("compares versions as numbers and skips peeled and other tags", () => {
    const lsRemote = [
      "a\trefs/tags/v0.9.0",
      "b\trefs/tags/v0.21.0",
      "c\trefs/tags/v0.21.0^{}",
      "d\trefs/tags/v0.3.10",
      "e\trefs/tags/nightly",
    ].join("\n")
    expect(latestTag(lsRemote)).toBe("v0.21.0")
    expect(latestTag("")).toBeUndefined()
  })
})

describe("toPage", () => {
  const context = { repo: "leemour/tg-cli", tag: "v1.2.3", pages: new Set(["usage", "archive"]), from: "docs/usage.md" }

  it("moves the title into the frontmatter and points links at pages, the changelog or GitHub", () => {
    const page = toPage(
      [
        "# How to use it",
        "",
        "See [archive](archive.md#search), [what changed](../CHANGELOG.md), [the code](../src/app.ts),",
        "[the plan](dev/plan.md#a) and ![logo](design/logo.png) or [npm](https://npmjs.com).",
      ].join("\n"),
      context,
    )
    expect(page).toBe(
      [
        "---",
        'title: "How to use it"',
        "---",
        "",
        "See [archive](./archive.md#search), [what changed](./changelog.md), [the code](https://github.com/leemour/tg-cli/blob/v1.2.3/src/app.ts),",
        "[the plan](https://github.com/leemour/tg-cli/blob/v1.2.3/docs/dev/plan.md#a) and ![logo](https://raw.githubusercontent.com/leemour/tg-cli/v1.2.3/docs/design/logo.png) or [npm](https://npmjs.com).",
      ].join("\n"),
    )
  })

  it("leaves code alone and quotes a title with a colon", () => {
    const page = toPage("# Usage: the basics\n\n```sh\n# a comment\n[x](usage.md)\n```\n", context)
    expect(page).toBe('---\ntitle: "Usage: the basics"\n---\n\n```sh\n# a comment\n[x](usage.md)\n```\n')
  })
})
