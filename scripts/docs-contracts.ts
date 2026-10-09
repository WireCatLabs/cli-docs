import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as {
  name: string
  package: string
  repo: string
  docsRef: string
}[]
for (const tool of tools) {
  if (!/^v\d+\.\d+\.\d+$/.test(tool.docsRef)) throw new Error("Discovery requires an exact reviewed release")
  const directory = join(root, ".docs-tooling/releases", `${tool.name}-${tool.docsRef}`)
  mkdirSync(directory, { recursive: true })
  const metadata = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(tool.package)}/${tool.docsRef.slice(1)}`,
  ).then((r) => {
    if (!r.ok) throw new Error(`Cannot resolve ${tool.package}@${tool.docsRef}`)
    return r.json()
  })
  if (!existsSync(join(directory, "node_modules", tool.package, "package.json"))) {
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
        "/dev/null",
        `${tool.package}@${tool.docsRef.slice(1)}`,
      ],
      { stdio: "inherit" },
    )
  }
  const installed = JSON.parse(readFileSync(join(directory, "node_modules", tool.package, "package.json"), "utf8"))
  if (installed.version !== tool.docsRef.slice(1)) throw new Error("Installed discovery version differs from docsRef")
  const sandbox = mkdtempSync(join(tmpdir(), "wirecat-doc-discovery-"))
  const env: NodeJS.ProcessEnv = {
    NODE_ENV: "test",
    PATH: process.env.PATH ?? "",
    TMPDIR: sandbox,
    XDG_CONFIG_HOME: join(sandbox, "config"),
    XDG_DATA_HOME: join(sandbox, "data"),
    XDG_CACHE_HOME: join(sandbox, "cache"),
    NO_COLOR: "1",
  }
  for (const prefix of ["TG", "MAX", "CLI_MESSAGING"])
    for (const suffix of ["CONFIG_DIR", "STATE_DIR", "CACHE_DIR"])
      env[`${prefix}_${suffix}`] = join(sandbox, prefix, suffix)
  const binary = join(
    directory,
    "node_modules",
    tool.package,
    typeof installed.bin === "string" ? installed.bin : installed.bin[tool.name],
  )
  const raw = execFileSync(
    process.execPath,
    ["--import", join(root, "scripts/discovery-offline.mjs"), binary, "commands", "--json"],
    { env, encoding: "utf8", timeout: 30000, maxBuffer: 15_000_000 },
  )
  const program = JSON.parse(raw)
  if (program.cli !== tool.name || !Array.isArray(program.commands)) throw new Error("Invalid discovery contract")
  const target = join(root, ".docs-tooling/contracts")
  mkdirSync(target, { recursive: true })
  writeFileSync(
    join(target, `${tool.name}.json`),
    JSON.stringify(
      {
        tool: tool.name,
        docsRef: tool.docsRef,
        package: tool.package,
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
  console.log(`Captured ${tool.name} ${installed.version} command contract with network disabled`)
}
