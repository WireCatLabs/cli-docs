import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { createSandbox } from "./cli-sandbox.ts"
import { discoveryContract } from "./discovery-contract.ts"
import type { Program } from "./docs-quality.ts"
import { checkoutSource, sourceInstallation } from "./source-install.ts"
import type { Tool } from "./sync.ts"

export async function captureContract(
  tool: Tool & { docsRef: string },
  root: string,
  target = join(root, ".docs-tooling/contracts"),
): Promise<Program> {
  const source = sourceInstallation(tool)
  if (!source && !/^v\d+\.\d+\.\d+$/.test(tool.docsRef)) throw new Error("Discovery requires an exact reviewed release")
  const directory = join(root, ".docs-tooling/releases", `${tool.name}-${tool.docsRef}`)
  mkdirSync(directory, { recursive: true })
  const metadata = source
    ? { gitHead: tool.docsRef, dist: { integrity: `git:${tool.docsRef}` } }
    : await fetch(`https://registry.npmjs.org/${encodeURIComponent(tool.package)}/${tool.docsRef.slice(1)}`).then(
        (r) => {
          if (!r.ok) throw new Error(`Cannot resolve ${tool.package}@${tool.docsRef}`)
          return r.json()
        },
      )
  const packageRoot = source ? join(directory, "source") : join(directory, "node_modules", tool.package)
  if (source) {
    if (!existsSync(join(packageRoot, ".git"))) checkoutSource(tool, packageRoot)
    const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: packageRoot, encoding: "utf8" }).trim()
    if (head !== tool.docsRef) throw new Error("Source discovery checkout differs from reviewed commit")
    const { dir: buildHome, env: sandboxed } = createSandbox("build")
    const userConfig = join(buildHome, "npm-user-config")
    const globalConfig = join(buildHome, "npm-global-config")
    writeFileSync(userConfig, "")
    writeFileSync(globalConfig, "")
    const buildEnv: NodeJS.ProcessEnv = {
      ...sandboxed,
      NPM_CONFIG_GLOBALCONFIG: globalConfig,
      NPM_CONFIG_USERCONFIG: userConfig,
    }
    execFileSync("pnpm", ["install", "--frozen-lockfile", "--ignore-scripts"], {
      cwd: packageRoot,
      env: buildEnv,
      stdio: "inherit",
    })
    execFileSync("pnpm", ["build"], { cwd: packageRoot, env: buildEnv, stdio: "inherit" })
  } else if (!existsSync(join(packageRoot, "package.json"))) {
    execFileSync(
      "npm",
      [
        "install",
        "--prefix",
        directory,
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--userconfig",
        process.env.NPM_CONFIG_USERCONFIG ?? "/dev/null",
        `${tool.package}@${tool.docsRef.slice(1)}`,
      ],
      { stdio: "inherit" },
    )
  }
  const installed = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"))
  if (!source && installed.version !== tool.docsRef.slice(1))
    throw new Error("Installed discovery version differs from docsRef")
  const { env } = createSandbox("discovery")
  const binary = join(packageRoot, typeof installed.bin === "string" ? installed.bin : installed.bin[tool.name])
  const raw = execFileSync(
    process.execPath,
    ["--import", join(root, "scripts/discovery-offline.mjs"), binary, "commands", "--json"],
    { env, encoding: "utf8", timeout: 30000, maxBuffer: 15_000_000 },
  )
  const program = discoveryContract(JSON.parse(raw), tool.name)
  mkdirSync(target, { recursive: true })
  writeFileSync(
    join(target, `${tool.name}.json`),
    JSON.stringify(
      {
        tool: tool.name,
        docsRef: tool.docsRef,
        package: tool.package,
        distribution: source ? "source" : "npm",
        gitHead: metadata.gitHead,
        integrity: metadata.dist.integrity,
        dependencies: installed.dependencies,
        sha256: createHash("sha256").update(raw).digest("hex"),
        program,
      },
      null,
      2,
    ),
  )
  console.log(
    `Captured ${tool.name} ${source ? tool.docsRef : installed.version} command contract with network disabled`,
  )
  return program
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as (Tool & { docsRef: string })[]
  for (const tool of tools) await captureContract(tool, root)
}
