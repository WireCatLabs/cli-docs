import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const root = resolve(".docs-tooling/releases")
const results = []
const reviewed = JSON.parse(readFileSync("tools.json", "utf8"))
for (const { name: tool, docsRef, package: packageName } of reviewed) {
  const version = docsRef.replace(/^v/, "")
  const require = createRequire(join(root, `${tool}-v${version}`, "node_modules", packageName, "package.json"))
  const manifest = require("./package.json")
  const messaging = Object.keys(manifest.dependencies).find((name) => name.endsWith("/cli-messaging"))
  assert.ok(messaging, "Reviewed release must declare its messaging dependency")
  const base = resolve(require.resolve(`${messaging}/services`), "../..")
  const { openStore } = await import(pathToFileURL(join(base, "store/index.js")))
  const { storedDeps, adminStatisticsService } = await import(pathToFileURL(join(base, "services/index.js")))
  const account = { provider: "fixture", account: "synthetic-owner" }
  const store = await openStore({ path: join(mkdtempSync(join(tmpdir(), "wirecat-doc-report-")), "fixture.db") })
  const make = (id, text, day, sender, reply) => ({
    id,
    chatId: "room",
    senderId: sender,
    senderName: sender,
    timestamp: `2026-10-0${day}T10:00:00Z`,
    editedAt: null,
    text,
    outgoing: false,
    reactions: null,
    attachments: [],
    replyTo: null,
    forwardedFrom: null,
    providerMetadata: { graph: { version: 1, reply: reply ? { chatId: "room", messageId: reply } : null } },
    ...(reply ? { replyToId: reply } : {}),
  })
  const originalNow = Date.now
  Date.now = () => Date.parse("2026-10-08T12:00:00Z")
  try {
    await store.saveChats(account, [
      {
        id: "room",
        title: "Synthetic project group",
        kind: "group",
        unreadCount: null,
        lastMessageAt: null,
        participantsCount: null,
      },
    ])
    await store.saveMessages(
      account,
      "room",
      [
        make("101", "When is the presentation ready?", 1, "member"),
        make("102", "It is ready.", 2, "admin", "101"),
        make("103", "Which version should we use?", 3, "member"),
      ],
      { via: "test" },
    )
    const deps = storedDeps(
      {
        provider: "fixture",
        app: { command: "fixture", envPrefix: "FIXTURE", configName: "fixture", stateName: "fixture" },
        chatArgument: "stored chat",
        savedChatId: "me",
      },
      store,
      account,
      { check() {}, record() {} },
    )
    const service = adminStatisticsService(deps)
    const found = await service.report("responses", {
      text: "date:[2026-10-01 TO 2026-10-07]",
      answerers: ["admin"],
      limit: 20,
    })
    assert.equal(found.summary.questions, 2)
    assert.equal(found.summary.answered, 1)
    assert.equal(found.summary.noObservedAnswer, 1)
    assert.equal(found.quality.archives[0].state, "unknown")
    assert.equal(found.quality.graph.complete, true)
    const waiting = await service.report("unanswered", {
      chat: "room",
      answerers: ["admin"],
      olderThan: "1h",
      limit: 20,
    })
    assert.equal(waiting.items.length, 1)
    results.push({
      tool,
      version,
      summary: found.summary,
      quality: found.quality,
      waiting: waiting.items.map((row) => row.id),
    })
  } finally {
    Date.now = originalNow
    await store.close()
  }
}
mkdirSync(".docs-tooling/reports/approved-proposals", { recursive: true })
writeFileSync(".docs-tooling/reports/approved-proposals/report-fixture.json", `${JSON.stringify(results, null, 2)}\n`)
console.log(
  "Both reviewed releases: two synthetic questions, one observed answer, one question without an observed answer.",
)
