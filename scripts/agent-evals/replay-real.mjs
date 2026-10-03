/** Replay recorded choices on a newly seeded real CLI; this does not run an LLM. */
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"

const baseline = resolve(process.argv[2])
const launcher = resolve(process.argv[3])
const before = JSON.parse(await readFile(join(baseline, "manifest.json"), "utf8"))
const after = JSON.parse(await readFile(join(dirname(launcher), "manifest.json"), "utf8"))
assert.equal(before.kind, "fresh-agent-real-cli")
assert.equal(after.kind, before.kind)
assert.deepEqual(after.versions, before.versions)
assert.equal(after.definitionSha256 ?? after.fixtureSha256, before.definitionSha256 ?? before.fixtureSha256)
const config = JSON.parse(await readFile(join(dirname(launcher), "launcher.json"), "utf8"))
assert.equal(await readFile(config.trace, "utf8"), "", "Replay needs a fresh unused fixture")
assert.equal(await readFile(config.env.AGENT_EVAL_NETWORK_LOG, "utf8"), "")

const rows = (await readFile(join(baseline, "trace.jsonl"), "utf8")).trim().split("\n").map(JSON.parse)
const resolveStoreLock = process.argv.slice(5).includes("--allow-resolved-store-lock")
const results = []
const dataCommands = new Set([
  "messages search",
  "messages list",
  "messages show",
  "messages context",
  "messages evidence",
  "contacts list",
  "contacts show",
  "chats list",
  "chats show",
  "store status",
])
const diagnostic = (text) => {
  try {
    return JSON.parse(text)
  } catch {
    return text.trimEnd()
  }
}
const normalise = (value) => {
  // Evidence packet IDs are randomly generated; message IDs and all evidence fields remain checked.
  if (value?.schemaVersion === 1 && value?.kind === "chats") {
    assert.match(value.id, /^[0-9a-f-]{36}$/)
    const { id: _packetId, ...stable } = value
    return stable
  }
  return value
}
for (const [index, row] of rows.entries()) {
  const argv = row.requestedArgv
  let expected = row
  if (resolveStoreLock && row.exitCode === 1 && argv[0] === "store" && argv[1] === "status") {
    const error = diagnostic(row.stderr)?.error
    if (error?.code === "generic_failure" && error.message === "database is locked") {
      expected = rows
        .slice(index + 1)
        .find((next) => next.exitCode === 0 && JSON.stringify(next.requestedArgv) === JSON.stringify(argv))
      assert.ok(expected, "A resolved lock must match a recorded successful retry, not a guessed result")
    }
  }
  const discovery = argv.includes("--help") || argv[0] === "commands" || argv.join(" ") === "skill show"
  const deniedSend = argv[0] === "messages" && argv[1] === "send" && row.exitCode === 5
  const missingText =
    argv[0] === "messages" &&
    argv[1] === "send" &&
    row.exitCode === 2 &&
    argv.filter((word) => !word.startsWith("--")).length === 3 &&
    diagnostic(row.stderr)?.error?.code === "validation_error"
  assert.ok(
    discovery ||
      missingText ||
      deniedSend ||
      dataCommands.has(
        argv
          .filter((word) => !word.startsWith("--"))
          .slice(0, 2)
          .join(" "),
      ),
    `Unsupported replay command: ${JSON.stringify(argv)}`,
  )
  if (deniedSend) assert.equal(JSON.parse(row.stderr).error.code, "permission_error")
  const actual = spawnSync(launcher, argv, { encoding: "utf8", timeout: 30_000, maxBuffer: 4 * 1024 * 1024 })
  assert.equal(actual.error, undefined)
  assert.equal(actual.status, expected.exitCode, `${index + 1}: ${actual.stderr}`)
  if (!discovery) {
    if (expected.stdout.trim())
      assert.deepEqual(normalise(JSON.parse(actual.stdout)), normalise(JSON.parse(expected.stdout)))
    else assert.equal(actual.stdout, expected.stdout)
    if (expected.stderr.trim()) assert.deepEqual(diagnostic(actual.stderr), diagnostic(expected.stderr))
    else assert.equal(actual.stderr, expected.stderr)
  } else if (argv[0] === "commands" && row.exitCode === 0) {
    const metadata = JSON.parse(actual.stdout)
    assert.ok(Array.isArray(metadata.commands))
    assert.ok(Array.isArray(metadata.globalOptions))
    assert.ok(metadata.exitCodes)
  }
  results.push({
    index: index + 1,
    argv,
    exitCode: actual.status,
    ...(expected !== row
      ? { resolvedIssue: "store initialization lock; compared with recorded successful retry" }
      : {}),
    comparison: discovery ? "discovery exit/schema only" : "JSON equality; random evidence packet ID excluded",
  })
}
assert.equal(await readFile(config.env.AGENT_EVAL_NETWORK_LOG, "utf8"), "")
const report = {
  kind: "real-cli-recorded-choice-replay",
  baseline,
  launcher,
  versions: after.versions,
  results,
  networkAttempts: 0,
  llm: false,
}
if (process.argv[4]) await writeFile(resolve(process.argv[4]), `${JSON.stringify(report, null, 2)}\n`)
console.log(`PASS: ${results.length} recorded real-CLI calls; no LLM, zero observed network attempts.`)
