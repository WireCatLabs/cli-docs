import { describe, expect, it } from "vitest"
import { browserSourceProblems, browserTimingProblems } from "./browser-test-policy"

const header = 'import AxeBuilder from "@axe-core/playwright";'
const scan = "await new AxeBuilder({ page }).analyze()"
const policy = (source: string) => browserSourceProblems(header + source)
const report = (duration = 1000, timeout = 30000) => ({
  stats: { unexpected: 0, flaky: 0 },
  suites: [
    {
      specs: [
        { title: "example", tests: [{ timeout, expectedStatus: "passed", results: [{ status: "passed", duration }] }] },
      ],
    },
  ],
})

describe("browser test structure", () => {
  it("allows outer loops that generate independent cases and named test steps", () => {
    expect(
      policy(
        `for (const route of routes) test(route, async () => { await test.step('a11y', async () => { ${scan} }); });`,
      ),
    ).toEqual([])
  })
  it.each(["for (const route of routes)", "while (ready)", "do"])("rejects a repeated scan in %s", (loop) => {
    const body = loop === "do" ? `do { ${scan}; } while (ready);` : `${loop} { ${scan}; }`
    expect(policy(`test('grouped', async () => { ${body} });`)).toContainEqual(expect.stringContaining("runtime loop"))
  })
  it.each(["map", "forEach", "flatMap"])("rejects scans in a %s callback", (method) => {
    expect(policy(`test('grouped', async () => { routes.${method}(async () => { ${scan}; }); });`)).toContainEqual(
      expect.stringContaining("runtime loop"),
    )
  })
  it("rejects two scans in one callback without a loop", () => {
    expect(policy(`test('two', async () => { ${scan}; ${scan}; });`)).toContainEqual(
      expect.stringContaining("2 analyze()"),
    )
  })
  it("checks imported test aliases and optional analyzer calls", () => {
    expect(
      policy(
        `import { test as browserTest } from '@playwright/test'; browserTest('aliases', async () => { for (const route of routes) { await builder.analyze?.(); } });`,
      ),
    ).toContainEqual(expect.stringContaining("runtime loop"))
  })
  it("parses JSX browser tests without losing repeated-scan detection", () => {
    const source =
      header + `test('jsx', async () => { const node = <span />; for (const route of routes) { ${scan}; } });`
    expect(browserSourceProblems(source, "widget.test.tsx")).toContainEqual(expect.stringContaining("runtime loop"))
  })
  it("does not treat comments or string examples as scan calls", () => {
    expect(policy(`test('copy', async () => { const text = '${scan}'; /* ${scan} */ });`)).toEqual([])
  })
})

describe("browser timing headroom", () => {
  it("accepts actual durations below the threshold", () => expect(browserTimingProblems(report(23999))).toEqual([]))
  it("rejects a passing case that consumes the headroom", () => {
    expect(browserTimingProblems(report(24000))).toContainEqual(expect.stringContaining("80%"))
  })
  it("rejects attempts to hide slowness with unlimited or excessive deadlines", () => {
    for (const timeout of [0, 180001]) expect(browserTimingProblems(report(1000, timeout))).not.toEqual([])
  })
  it("rejects empty, malformed and flaky reports", () => {
    expect(browserTimingProblems({})).not.toEqual([])
    expect(browserTimingProblems({ suites: [] })).not.toEqual([])
    expect(browserTimingProblems({ ...report(), stats: { flaky: 1 } })).not.toEqual([])
  })
})
