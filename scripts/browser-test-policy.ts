import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "@babel/parser"

type Node = Record<string, unknown> & { type: string }
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
const isNode = (value: unknown): value is Node => isRecord(value) && typeof value.type === "string"
const children = (node: Node): Node[] =>
  Object.values(node).flatMap((value) => (Array.isArray(value) ? value.filter(isNode) : isNode(value) ? [value] : []))
const member = (node: unknown): string | undefined =>
  isNode(node) &&
  (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") &&
  isNode(node.property)
    ? String(node.property.name ?? node.property.value)
    : undefined
const isCall = (node: Node) => ["CallExpression", "OptionalCallExpression"].includes(node.type)
const isTestCall = (node: Node, names: Set<string>): boolean => {
  if (!isCall(node) || !isNode(node.callee)) return false
  const callee = node.callee
  if (callee.type === "Identifier" && names.has(String(callee.name))) return true
  return (
    ["only", "skip", "fixme"].includes(member(callee) ?? "") &&
    isNode(callee.object) &&
    callee.object.type === "Identifier" &&
    names.has(String(callee.object.name))
  )
}

/** Enforce direct scan calls in each test callback; outer loops may generate independent cases. */
export function browserSourceProblems(source: string, file = "test.spec.ts"): string[] {
  const root = parse(source, { sourceType: "module", plugins: ["typescript"] }) as unknown as Node
  const problems: string[] = []
  if (!source.includes("@axe-core/playwright")) return problems
  const testNames = new Set(["test"])
  const imports = (node: Node) => {
    if (
      node.type === "ImportSpecifier" &&
      isNode(node.imported) &&
      isNode(node.local) &&
      node.imported.name === "test"
    ) {
      testNames.add(String(node.local.name))
    }
    for (const child of children(node)) imports(child)
  }
  imports(root)
  const discover = (node: Node) => {
    if (isTestCall(node, testNames) && Array.isArray(node.arguments)) {
      const callback = node.arguments.find(
        (arg) => isNode(arg) && ["ArrowFunctionExpression", "FunctionExpression"].includes(arg.type),
      )
      if (isNode(callback)) {
        const scans: Node[] = []
        const inspect = (part: Node, loops: number) => {
          if (isCall(part) && member(part.callee) === "analyze") {
            scans.push(part)
            if (loops > 0) {
              const loc = isRecord(part.loc) && isRecord(part.loc.start) ? part.loc.start.line : "?"
              problems.push(`${file}:${loc}: analyze() inside a runtime loop; generate one test per scan instead`)
            }
          }
          const loop = [
            "ForStatement",
            "ForOfStatement",
            "ForInStatement",
            "WhileStatement",
            "DoWhileStatement",
          ].includes(part.type)
          const iteration =
            part.type === "CallExpression" &&
            ["map", "flatMap", "forEach", "reduce"].includes(member(part.callee) ?? "")
          for (const child of children(part)) {
            const repeatedCallback = iteration && ["ArrowFunctionExpression", "FunctionExpression"].includes(child.type)
            inspect(child, loops + Number(loop || repeatedCallback))
          }
        }
        inspect(callback, 0)
        if (scans.length > 1)
          problems.push(
            `${file}: a test contains ${scans.length} analyze() calls; split the scans into independent cases`,
          )
      }
    }
    for (const child of children(node)) discover(child)
  }
  discover(root)
  return problems
}

/** Check every passing case's actual duration against its declared deadline. */
export function browserTimingProblems(report: unknown): string[] {
  if (!isRecord(report) || !Array.isArray(report.suites)) return ["Missing or malformed Playwright JSON report"]
  const problems: string[] = []
  let passed = 0
  if (isRecord(report.stats) && (Number(report.stats.unexpected) > 0 || Number(report.stats.flaky) > 0)) {
    problems.push("Browser report contains unexpected failures or flaky retries")
  }
  const walk = (suite: unknown) => {
    if (!isRecord(suite)) return
    for (const spec of Array.isArray(suite.specs) ? suite.specs : []) {
      if (!isRecord(spec)) continue
      for (const test of Array.isArray(spec.tests) ? spec.tests : []) {
        if (!isRecord(test)) continue
        for (const result of Array.isArray(test.results) ? test.results : []) {
          if (!isRecord(result) || result.status === "skipped") continue
          if (result.status !== test.expectedStatus) problems.push(`${spec.title}: unexpected ${result.status} result`)
          if (result.status !== "passed") continue
          passed++
          const { timeout } = test
          const { duration } = result
          if (typeof timeout !== "number" || !Number.isFinite(timeout) || timeout <= 0 || timeout > 180000) {
            problems.push(`${spec.title}: deadline must be positive and at most 180 seconds`)
          } else if (typeof duration !== "number" || !Number.isFinite(duration) || duration < 0) {
            problems.push(`${spec.title}: missing or invalid duration`)
          } else if (duration >= timeout * 0.8) {
            problems.push(
              `${spec.title}: ${duration}ms uses at least 80% of its ${timeout}ms deadline; split or profile the case`,
            )
          }
        }
      }
    }
    for (const child of Array.isArray(suite.suites) ? suite.suites : []) walk(child)
  }
  for (const suite of report.suites) walk(suite)
  if (!passed) problems.push("Browser report contains no passing cases")
  return problems
}

export function checkBrowserSources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith(".")) return checkBrowserSources(path)
    return entry.isFile() && entry.name.endsWith(".spec.ts")
      ? browserSourceProblems(readFileSync(path, "utf8"), path)
      : []
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const reportFlag = process.argv.indexOf("--report")
  const reportPath = process.argv[reportFlag + 1]
  if (reportFlag >= 0 && !reportPath) throw new Error("--report requires the Playwright JSON path")
  const problems =
    reportFlag >= 0
      ? browserTimingProblems(JSON.parse(readFileSync(reportPath, "utf8")))
      : checkBrowserSources(join(root, "tests"))
  if (problems.length) {
    for (const problem of problems) console.error(problem)
    process.exitCode = 1
  } else
    console.log(
      reportFlag >= 0
        ? "Browser timings: every case retains 20% timeout headroom"
        : "Browser test structure: one accessibility scan per independent case",
    )
}
