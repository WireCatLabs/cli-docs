import { spawnSync } from "node:child_process"
import { readFileSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createSandbox } from "./cli-sandbox.ts"
import type { Tool } from "./sync.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const [name, ...args] = process.argv.slice(2)
const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as (Tool & { docsRef: string })[]
const tool = tools.find((candidate) => candidate.name === name)
if (!tool) {
  console.error(`Usage: pnpm docs:cli <${tools.map((t) => t.name).join("|")}> <args…>`)
  process.exit(2)
}
const packageRoot = join(root, ".docs-tooling/releases", `${tool.name}-${tool.docsRef}`, "node_modules", tool.package)
const { bin } = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"))
const { dir, env } = createSandbox("cli")
const result = spawnSync(
  process.execPath,
  [
    "--import",
    join(root, "scripts/discovery-offline.mjs"),
    join(packageRoot, typeof bin === "string" ? bin : bin[tool.name]),
    ...args,
  ],
  { env, stdio: "inherit" },
)
rmSync(dir, { recursive: true, force: true })
process.exit(result.status ?? 1)
