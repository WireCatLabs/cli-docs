import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { discoveryContract } from "./discovery-contract.ts"
import { checkoutSource, sourceInstallation } from "./source-install.ts"
import type { Tool } from "./sync.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as (Tool & { docsRef: string })[]
for (const tool of tools) {
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
    const buildHome = mkdtempSync(join(tmpdir(), "wirecat-doc-build-"))
    const userConfig = join(buildHome, "npm-user-config")
    const globalConfig = join(buildHome, "npm-global-config")
    writeFileSync(userConfig, "")
    writeFileSync(globalConfig, "")
    const buildEnv: NodeJS.ProcessEnv = {
      HOME: buildHome,
      XDG_CONFIG_HOME: join(buildHome, "config"),
      XDG_STATE_HOME: join(buildHome, "state"),
      XDG_CACHE_HOME: join(buildHome, "cache"),
      MESSAGING_STORE: join(buildHome, "wirecat.db"),
      NPM_CONFIG_GLOBALCONFIG: globalConfig,
      PATH: process.env.PATH ?? "",
      NODE_ENV: "test",
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
  const sandbox = mkdtempSync(join(tmpdir(), "wirecat-doc-discovery-"))
  const env: NodeJS.ProcessEnv = {
    HOME: sandbox,
    MESSAGING_STORE: join(sandbox, "wirecat.db"),
    XDG_STATE_HOME: join(sandbox, "state"),
    NODE_ENV: "test",
    PATH: process.env.PATH ?? "",
    TMPDIR: sandbox,
    XDG_CONFIG_HOME: join(sandbox, "config"),
    XDG_DATA_HOME: join(sandbox, "data"),
    XDG_CACHE_HOME: join(sandbox, "cache"),
    NO_COLOR: "1",
  }
  for (const prefix of ["TG", "MAX", "DRIVE", "MEMO", "CLI_MESSAGING"])
    for (const suffix of ["CONFIG_DIR", "STATE_DIR", "CACHE_DIR"])
      env[`${prefix}_${suffix}`] = join(sandbox, prefix, suffix)
  const binary = join(packageRoot, typeof installed.bin === "string" ? installed.bin : installed.bin[tool.name])
  const raw = execFileSync(
    process.execPath,
    ["--import", join(root, "scripts/discovery-offline.mjs"), binary, "commands", "--json"],
    { env, encoding: "utf8", timeout: 30000, maxBuffer: 15_000_000 },
  )
  const program = discoveryContract(JSON.parse(raw), tool.name)
  const target = join(root, ".docs-tooling/contracts")
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
}
