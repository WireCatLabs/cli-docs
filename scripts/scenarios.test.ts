import { describe, expect, it } from "vitest"
import { crossToolScenarios, parseScenario, scenarioPage } from "./scenarios.ts"
import { withScenarios } from "./sync.ts"

const file = [
  "---",
  "title: catch up after a day away",
  "goal: Know who waits on you.",
  "steps:",
  "  - run: tg review 'date>1d'",
  "    why: every message since <yesterday>",
  "look: who asked first",
  "---",
  "",
  "Nothing is marked read.",
  "",
].join("\n")

describe("parseScenario", () => {
  it("reads the guide fields and keeps the body for the site", () => {
    expect(parseScenario("catch-up.md", file)).toEqual({
      name: "catch-up",
      title: "catch up after a day away",
      goal: "Know who waits on you.",
      steps: [{ run: "tg review 'date>1d'", why: "every message since <yesterday>" }],
      look: ["who asked first"],
      body: "Nothing is marked read.",
    })
  })

  it("refuses a file the guide command would refuse", () => {
    expect(() => parseScenario("Catch_Up.md", file)).toThrow("lower case")
    expect(() => parseScenario("catch-up.md", file.replace("  - run: tg review 'date>1d'\n", ""))).toThrow("steps")
  })
})

describe("scenarioPage", () => {
  const scenario = parseScenario("catch-up.md", file)
  const memo = parseScenario("person-brief.md", file.replace("tg review", "zm meetings context"))

  it("fences each command, escapes prose and names the guide command", () => {
    const page = scenarioPage({ name: "tg" }, [scenario], [memo])
    expect(page).toContain('<a id="catch-up" />\n\n## Catch up after a day away')
    expect(page).toContain("1. ```sh\n   tg review 'date>1d'\n   ```\n\n   every message since &lt;yesterday>")
    expect(page).toContain("`tg <profile> …`")
    expect(page).toContain("In the terminal: `tg guide catch-up`")
    expect(page).toContain("(https://wirecat.dev/en/docs/memo/scenarios#person-brief): `memo guide person-brief`")
  })

  it("leaves out the profile line for a tool without profiles", () => {
    expect(scenarioPage({ name: "tg", profile: false }, [scenario])).not.toContain("<profile>")
  })

  it("links a memo scenario only from the tools its steps run", () => {
    expect(crossToolScenarios("zm", [scenario, memo])).toEqual([memo])
    expect(crossToolScenarios("max", [scenario, memo])).toEqual([])
  })
})

describe("withScenarios", () => {
  it("follows recipes, or closes the guides group when there are none", () => {
    expect(withScenarios(["---Start---", "index", "---Guides---", "usage", "recipes", "---Reference---"])).toEqual([
      "---Start---",
      "index",
      "---Guides---",
      "usage",
      "recipes",
      "scenarios",
      "---Reference---",
    ])
    expect(
      withScenarios(["---Start---", "index", "---Guides---", "usage", "mcp", "---Reference---", "commands"]),
    ).toEqual(["---Start---", "index", "---Guides---", "usage", "mcp", "scenarios", "---Reference---", "commands"])
  })
})
