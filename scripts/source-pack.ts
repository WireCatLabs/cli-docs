import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"

export function allowedSource(path: string): boolean {
  if (path.includes("\\") || path.split("/").some((part) => part.startsWith(".") || part === "..")) return false
  if (
    /(^|\/)(?:secrets|credentials|captures|fixtures|node_modules|dist|docs_ai|agent-evals|translations)(\/|$)/.test(
      path,
    )
  )
    return false
  if (/\.(?:pem|key|enc)$|(?:^|\/)master\.key$/.test(path)) return false
  return (
    /^(?:src|lib|components|scripts)\/.*\.(?:ts|tsx|js|mjs|json)$/.test(path) ||
    /^(?:README\.md|PRODUCT\.md|package\.json|tools\.json)$/.test(path) ||
    /^docs\/(?:AUTHORING|STRUCTURE|README)\.md$/.test(path) ||
    /^content\/docs\/[^/]+\.(?:md|mdx)$/.test(path)
  )
}

export function stageSource(root: string, destination: string, ref?: string, topic?: string) {
  const git = (args: string[]) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8" })
  const revision = git(["rev-parse", "--verify", `${ref ?? "HEAD"}^{commit}`]).trim()
  const files = (
    ref
      ? git(["ls-tree", "-r", "--name-only", "-z", revision])
      : git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
  )
    .split("\0")
    .filter(Boolean)
    .filter(allowedSource)
  const topics: Record<string, RegExp> = {
    login: /session|auth|login|setup|config|paths|program|package\.json/,
    search: /search|store|archive|evidence|conversation|package\.json/,
    replies: /send|repl|permission|guard|config|program|package\.json/,
  }
  if (topic && !topics[topic]) throw new Error("Topic must be login, search or replies")
  const entries: { path: string; sha256: string; bytes: number }[] = []
  const physicalRoot = realpathSync(root)
  for (const path of [...new Set(files)].sort()) {
    if (topic && !topics[topic].test(path)) continue
    let data: Buffer
    if (ref) {
      const mode = git(["ls-tree", revision, "--", path]).split(" ")[0]
      if (mode !== "100644" && mode !== "100755") continue
      data = execFileSync("git", ["-C", root, "show", `${revision}:${path}`])
    } else {
      const source = join(root, path)
      if (!existsSync(source)) continue
      if (
        !lstatSync(source).isFile() ||
        !realpathSync(source).startsWith(`${physicalRoot}/`) ||
        !allowedSource(realpathSync(source).slice(physicalRoot.length + 1))
      )
        continue
      data = readFileSync(source)
    }
    if (data.length > 500_000) continue
    mkdirSync(dirname(join(destination, path)), { recursive: true })
    writeFileSync(join(destination, path), data)
    entries.push({ path, sha256: createHash("sha256").update(data).digest("hex"), bytes: data.length })
  }
  if (!entries.length) throw new Error("No allowed source files selected")
  return { revision, mode: ref ? "commit" : "working-tree", topic: topic ?? "all", files: entries }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      repo: { type: "string" },
      ref: { type: "string" },
      topic: { type: "string" },
      compress: { type: "boolean" },
    },
  })
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
  const repo = values.repo ?? "site"
  const repositories: Record<string, string> = {
    site: root,
    tg: resolve(root, "../tg-cli"),
    max: resolve(root, "../max-cli"),
    core: resolve(root, "../cli-core"),
    messaging: resolve(root, "../cli-messaging"),
  }
  if (!repositories[repo]) throw new Error("Repository must be site, tg, max, core or messaging")
  const label = `${repo}-${values.topic ?? "all"}-${Date.now()}`
  const output = join(root, ".docs-tooling/packs", label)
  const snapshot = join(output, "source")
  const manifest = stageSource(repositories[repo], snapshot, values.ref, values.topic)
  const config = join(output, "repomix.config.json")
  writeFileSync(
    config,
    JSON.stringify(
      {
        output: {
          filePath: join(output, "source.xml"),
          style: "xml",
          parsableStyle: true,
          showLineNumbers: true,
          compress: values.compress ?? false,
        },
        security: { enableSecurityCheck: true },
        ignore: { useGitignore: false },
      },
      null,
      2,
    ),
  )
  const version = execFileSync(join(root, "node_modules/.bin/repomix"), ["--version"], { encoding: "utf8" }).trim()
  writeFileSync(
    join(output, "manifest.json"),
    JSON.stringify({ ...manifest, repomix: version, compressed: values.compress ?? false }, null, 2),
  )
  execFileSync(join(root, "node_modules/.bin/repomix"), [snapshot, "--config", config, "--quiet"], {
    cwd: output,
    stdio: "inherit",
  })
  console.log(`${manifest.files.length} allowed files packed: ${output}/source.xml`)
}
