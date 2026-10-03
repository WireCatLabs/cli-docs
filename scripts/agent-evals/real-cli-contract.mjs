/** Real tg@0.22.0 + real SQLite, synthetic data, no login session or provider.
 * Usage: node scripts/agent-evals/real-cli-contract.mjs <external-runtime> [report.json]
 * Runtime: npm install --prefix <external-runtime> @leemour/tg-cli@0.22.0
 */
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const runtime = resolve(process.argv[2] ?? "/tmp/wirecat-agent-eval-runtime")
const packageRoot = join(runtime, "node_modules/@leemour")
const pkg = async (name) => JSON.parse(await readFile(join(packageRoot, name, "package.json"), "utf8"))
const versions = { tg: (await pkg("tg-cli")).version, messaging: (await pkg("cli-messaging")).version }
assert.deepEqual(
  versions,
  { tg: "0.22.0", messaging: "0.112.0" },
  "Install the exact baseline runtime, not a global tg",
)
const { openStore } = await import(pathToFileURL(join(packageRoot, "cli-messaging/dist/store/index.js")))
const scratch = await mkdtemp(join(tmpdir(), "wirecat-real-cli-"))
const here = dirname(fileURLToPath(import.meta.url))
const networkLog = join(scratch, "network.jsonl")
// Construct an allowlisted environment; do not inherit auth, config, proxy or XDG values.
const env = {
  PATH: dirname(process.execPath),
  HOME: scratch,
  XDG_CONFIG_HOME: join(scratch, "xdg-config"),
  XDG_STATE_HOME: join(scratch, "xdg-state"),
  XDG_CACHE_HOME: join(scratch, "xdg-cache"),
  TG_CONFIG_DIR: join(scratch, "config"),
  TG_STATE_DIR: join(scratch, "state"),
  TG_CACHE_DIR: join(scratch, "cache"),
  MESSAGING_STORE: join(scratch, "messages.db"),
  AGENT_EVAL_NETWORK_LOG: networkLog,
  NO_COLOR: "1",
  TZ: "UTC",
}
const key = { provider: "telegram", account: "900001" }
const chatId = "-100700001"
const traces = []
const checks = []
const command = (argv, expectedExit = 0) => {
  const result = spawnSync(
    process.execPath,
    ["--import", join(here, "deny-network.mjs"), join(packageRoot, "tg-cli/dist/bin/tg.js"), ...argv],
    {
      env,
      encoding: "utf8",
      timeout: 15_000,
      maxBuffer: 4 * 1024 * 1024,
    },
  )
  const record = { argv, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
  traces.push(record)
  assert.equal(result.error, undefined, `CLI process failed: ${result.error}`)
  assert.equal(result.status, expectedExit, JSON.stringify(record))
  return record
}
const offline = (args, expectedExit = 0) => command(["--offline", "--json", ...args], expectedExit)
const json = (result) => JSON.parse(result.stdout)
const check = async (name, run) => {
  await run()
  checks.push({ name, passed: true })
}
const withStore = async (run) => {
  const store = await openStore({ env, now: () => Date.parse("2026-10-03T10:00:00Z") })
  try {
    return await run(store)
  } finally {
    await store.close()
  }
}
const chat = (id, title) => ({
  id,
  title,
  kind: "group",
  unreadCount: 0,
  lastMessageAt: "2026-09-13T10:00:00Z",
  participantsCount: 2,
})
const messages = [1, 2, 3].map((i) => ({
  id: String(i),
  chatId,
  senderId: "900002",
  senderName: "Synthetic Anna",
  timestamp: `2026-09-${i + 10}T10:00:00Z`,
  editedAt: null,
  text: i === 1 ? "Analytics quote: EUR 1500 excluding VAT." : `Planning update ${i}`,
  outgoing: false,
  attachments: [],
  replyTo: null,
  forwardedFrom: null,
  reactions: null,
}))

try {
  await writeFile(networkLog, "")
  await check("offline without an account mapping fails honestly", () => {
    const result = offline(["messages", "search", "analytics"], 6)
    assert.match(result.stderr, /nothing recorded/)
  })
  // This is the CLI's remembered account ID, NOT a Telegram session/token/credential.
  await mkdir(join(env.TG_STATE_DIR, "accounts"), { recursive: true })
  await writeFile(join(env.TG_STATE_DIR, "accounts/default.json"), `${JSON.stringify({ account: key.account })}\n`, {
    mode: 0o600,
  })
  await withStore(async (store) => {
    await store.saveAccount(key, { name: "Synthetic Owner" })
    await store.saveChats(key, [chat(chatId, "Atlas team")])
  })
  await check("empty local search is limited to the current store", () => {
    const result = json(offline(["messages", "search", "analytics"]))
    assert.deepEqual(result.items, [])
    assert.equal(result.hasMore, false)
    // This is an empty hit list, not a proof about Telegram's unseen history.
    assert.equal(result.completeness.length, 0)
  })
  await withStore(async (store) => {
    await store.saveMessages(key, chatId, messages, { via: "synthetic-fixture" })
    await store.fillSearchIndex()
  })
  await check("same search after local seeding finds the old quote with locator and unknown coverage", () => {
    const result = json(offline(["messages", "search", "analytics", "--chat", "Atlas"]))
    assert.equal(result.items.length, 1)
    assert.equal(result.items[0].text, messages[0].text)
    assert.equal(result.items[0].locator, `msg:telegram/${key.account}/${chatId}/1`)
    assert.equal(result.completeness[0].state, "unknown")
    assert.equal(result.completeness[0].reachesStart, false)
  })
  await check("messages list pages older history without skipping evidence", () => {
    const first = json(offline(["messages", "list", "Atlas", "--limit", "2"]))
    assert.deepEqual(
      first.items.map((m) => m.id),
      ["2", "3"],
    )
    assert.equal(first.hasMore, true)
    const second = json(offline(["messages", "list", "Atlas", "--limit", "2", "--before-id", first.items[0].id]))
    assert.deepEqual(
      second.items.map((m) => m.id),
      ["1"],
    )
    assert.equal(second.hasMore, false)
  })
  await check("evidence uses its own cursor and preserves unknown history", () => {
    const first = json(offline(["messages", "evidence", "Atlas", "--limit", "2"]))
    assert.equal(first.coverage.history, "unknown")
    assert.equal(first.coverage.hasMore, true)
    assert.equal(first.nextBeforeId, "2")
    const second = json(offline(["messages", "evidence", "Atlas", "--limit", "2", "--before-id", first.nextBeforeId]))
    assert.equal(second.items[0].text, messages[0].text)
    assert.equal(second.coverage.hasMore, false)
    assert.equal(second.coverage.history, "unknown")
  })
  await check("show accepts a source locator without an invented --chat flag", () => {
    const result = json(offline(["messages", "show", `msg:telegram/${key.account}/${chatId}/1`]))
    assert.equal(result.text, messages[0].text)
  })
  await check("missing offline chat returns not_found", () => {
    const result = offline(["messages", "list", "Missing chat"], 6)
    assert.match(result.stderr, /not_found/)
  })
  await check("offline cannot fetch missing history", () => {
    const result = offline(["store", "fetch", "Atlas"], 2)
    assert.match(result.stderr, /offline/)
  })
  await check("offline sending is refused before a provider connection", () => {
    const result = offline(["messages", "send", "Atlas", "Synthetic draft"], 2)
    assert.match(result.stderr, /offline/)
  })
  await check("configured deny stops even a non-offline send before connection", () => {
    command(["config", "set", "permissions", '{"messages.send":"deny"}'])
    const result = command(["--json", "messages", "send", "Atlas", "Synthetic draft"], 5)
    assert.match(result.stderr, /permission_error/)
    assert.match(result.stderr, /denies messages.send/)
  })
  await withStore((store) => store.saveChats(key, [chat("-100700002", "Atlas support")]))
  await check("ambiguous title is refused instead of selecting an arbitrary chat", () => {
    const result = offline(["messages", "list", "Atlas"], 2)
    assert.match(result.stderr, /ambig|more than one|several|matches/i)
  })
  await check("exact chat ID resolves title ambiguity", () => {
    const result = json(offline(["messages", "list", chatId]))
    assert.equal(result.items.length, 3)
  })
  await check("unsupported arguments fail visibly", () => {
    const result = offline(["messages", "show", "1", "--chat", "Atlas"], 1)
    assert.match(result.stderr, /unknown option '--chat'/)
  })
  await check("discovery and help describe actual local search and pagination flags", () => {
    const discovery = command(["commands", "--json"])
    JSON.parse(discovery.stdout)
    const searchHelp = command(["messages", "search", "--help"])
    assert.match(searchHelp.stdout, /local store/)
    assert.match(searchHelp.stdout, /--chat/)
    const listHelp = command(["messages", "list", "--help"])
    assert.match(listHelp.stdout, /--before-id/)
    assert.match(listHelp.stdout, /--mark-read/)
  })
  await check("none of the tested CLI operations attempted a network primitive", async () => {
    assert.equal(await readFile(networkLog, "utf8"), "")
  })
  const hash = async (file) =>
    createHash("sha256")
      .update(await readFile(file))
      .digest("hex")
  const report = {
    schemaVersion: 1,
    kind: "real-cli-offline-contract",
    versions,
    node: process.version,
    fixture: "three synthetic messages, two synthetic chats, one synthetic noncredential account mapping",
    runnerSha256: await hash(fileURLToPath(import.meta.url)),
    networkGuardSha256: await hash(join(here, "deny-network.mjs")),
    scope:
      "Actual CLI parser/renderers/services/store and deny permission. No LLM, authentication, live provider, online ingestion or keyring test.",
    checks,
    traces,
  }
  if (process.argv[3]) {
    const output = resolve(process.argv[3])
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  }
  console.log(
    `PASS: ${checks.length} real-CLI offline contract checks, ${traces.length} CLI calls, zero network attempts.`,
  )
} finally {
  await rm(scratch, { recursive: true, force: true })
}
