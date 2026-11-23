import type { AddressInfo } from "node:net"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createAmoConnect, createStore, storageKey } from "../services/amo-connect/server.mjs"

const STATE = `53682.${"a".repeat(20)}_${"B".repeat(20)}-9z`
const CLIENT_ID = "0f6c1d2e-3a4b-4c5d-8e9f-a0b1c2d3e4f5"
const SECRET = "s3cr3t-value-that-must-never-be-logged"

const servers: ReturnType<typeof createAmoConnect>[] = []

async function start(options: { maxEntries?: number } = {}) {
  let time = 1_000_000
  const clock = { now: () => time, advance: (ms: number) => (time += ms) }
  const store = createStore({ now: clock.now, ...options })
  const logged: string[] = []
  const server = createAmoConnect({ store, log: (line: string) => logged.push(line) })
  servers.push(server)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  const post = (path: string, body: string, contentType = "application/json") =>
    fetch(`${base}${path}`, { method: "POST", headers: { "Content-Type": contentType }, body })
  return { base, store, clock, logged, post }
}

const json = (value: unknown) => JSON.stringify(value)
const webhook = (extra: Record<string, unknown> = {}) =>
  json({ client_id: CLIENT_ID, client_secret: SECRET, state: STATE, ...extra })

afterEach(async () => {
  vi.restoreAllMocks()
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => server.close(resolve))))
})

describe("amo-connect service", () => {
  it("stores the webhook under the state's hash and hands it out once", async () => {
    const { store, post } = await start()
    const stored = await post("/api/amo/secrets", webhook())
    expect(stored.status).toBe(200)
    expect(await stored.text()).toBe("")
    expect(store.keys()).toEqual([storageKey(STATE)])
    expect(store.keys()[0]).toMatch(/^[0-9a-f]{64}$/)

    const first = await post("/api/amo/claim", json({ state: STATE }))
    expect(first.status).toBe(200)
    expect(first.headers.get("cache-control")).toBe("no-store")
    expect(await first.json()).toEqual({ client_id: CLIENT_ID, client_secret: SECRET })

    const second = await post("/api/amo/claim", json({ state: STATE }))
    expect(second.status).toBe(404)
    expect(await second.json()).toEqual({ error: "not_ready" })
  })

  it("answers not_ready before the webhook arrives", async () => {
    const { post } = await start()
    const response = await post("/api/amo/claim", json({ state: STATE }))
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: "not_ready" })
  })

  it("forgets the keys after 600 seconds", async () => {
    const { clock, store, post } = await start()
    await post("/api/amo/secrets", webhook())
    clock.advance(599_999)
    expect(store.keys()).toHaveLength(1)
    clock.advance(1)
    expect((await post("/api/amo/claim", json({ state: STATE }))).status).toBe(404)
    expect(store.keys()).toEqual([])
  })

  it("refuses new keys when the store is full, and takes them again once old ones expire", async () => {
    const { clock, logged, post } = await start({ maxEntries: 1 })
    await post("/api/amo/secrets", webhook())
    const other = `53683.${"c".repeat(43)}`
    expect((await post("/api/amo/secrets", webhook({ state: other }))).status).toBe(503)
    expect(logged.join(" ")).not.toContain(SECRET)
    clock.advance(600_000)
    expect((await post("/api/amo/secrets", webhook({ state: other }))).status).toBe(200)
  })

  it("accepts a form-encoded webhook", async () => {
    const { store, post } = await start()
    const body = new URLSearchParams({ client_id: CLIENT_ID, client_secret: SECRET, state: STATE }).toString()
    expect((await post("/api/amo/secrets", body, "application/x-www-form-urlencoded")).status).toBe(200)
    expect(store.keys()).toHaveLength(1)
  })

  it.each([
    ["no state", { client_id: CLIENT_ID, client_secret: SECRET }],
    ["a state without a port", { client_id: CLIENT_ID, client_secret: SECRET, state: "a".repeat(50) }],
    ["a privileged port", { client_id: CLIENT_ID, client_secret: SECRET, state: `80.${"a".repeat(43)}` }],
    ["a short random part", { client_id: CLIENT_ID, client_secret: SECRET, state: `53682.${"a".repeat(42)}` }],
    ["a client_id that is not a uuid", { client_id: "1; drop", client_secret: SECRET, state: STATE }],
    ["an empty secret", { client_id: CLIENT_ID, client_secret: "", state: STATE }],
    ["a secret too long", { client_id: CLIENT_ID, client_secret: "x".repeat(513), state: STATE }],
  ])("refuses a webhook with %s and logs no value", async (_, body) => {
    const { store, logged, post } = await start()
    const response = await post("/api/amo/secrets", json(body))
    expect(response.status).toBe(400)
    expect(await response.text()).toBe("")
    expect(store.keys()).toEqual([])
    const line = logged.join(" ")
    expect(line).toContain("amo secrets refused")
    expect(line).not.toContain(SECRET)
    expect(line).not.toContain(CLIENT_ID)
    expect(line).not.toContain("a".repeat(43))
  })

  it("refuses a body over the size limit", async () => {
    const { store, post } = await start()
    const response = await post("/api/amo/secrets", webhook({ pad: "x".repeat(5000) }))
    expect(response.status).toBe(400)
    expect(store.keys()).toEqual([])
  })

  it("logs nothing on success", async () => {
    const { logged, post } = await start()
    await post("/api/amo/secrets", webhook())
    await post("/api/amo/claim", json({ state: STATE }))
    expect(logged).toEqual([])
  })

  it("refuses a claim with a malformed state", async () => {
    const { post } = await start()
    const response = await post("/api/amo/claim", json({ state: "nope" }))
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "bad_state" })
  })

  it("answers 405 to other methods on the endpoints", async () => {
    const { base } = await start()
    for (const path of ["/api/amo/secrets", "/api/amo/claim"]) {
      const response = await fetch(`${base}${path}`)
      expect(response.status).toBe(405)
      expect(response.headers.get("allow")).toBe("POST")
    }
  })

  it.each([
    ["/connect/amo.html", "text/html; charset=utf-8", "script-src 'self';"],
    ["/connect/amo.js", "text/javascript; charset=utf-8", "default-src 'none'"],
    ["/connect/wirecat-amo-logo.png", "image/png", "default-src 'none'"],
    ["/webhooks/apps/amo-callback", "text/html; charset=utf-8", "script-src 'self';"],
    ["/webhooks/apps/amo-callback.js", "text/javascript; charset=utf-8", "default-src 'none'"],
  ])("serves %s with its type and the security headers", async (path, type, csp) => {
    const { base } = await start()
    const response = await fetch(`${base}${path}?code=x&state=y`)
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toBe(type)
    expect(response.headers.get("content-security-policy")).toContain(csp)
    expect(response.headers.get("strict-transport-security")).toBe("max-age=31536000")
    expect(response.headers.get("x-content-type-options")).toBe("nosniff")
    expect(response.headers.get("referrer-policy")).toBe("no-referrer")
    expect(response.headers.get("x-frame-options")).toBe("DENY")
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow")
    expect(response.headers.get("access-control-allow-origin")).toBeNull()
  })

  it("points the button at this host", async () => {
    const { base } = await start()
    const script = await (await fetch(`${base}/connect/amo.js`)).text()
    expect(script).toContain('CALLBACK = "https://connect.wirecat.dev/webhooks/apps/amo-callback"')
    expect(script).toContain('secrets_uri: "https://connect.wirecat.dev/api/amo/secrets"')
    expect(script).not.toContain('createElement("script")')
    expect(script).toContain('logo: "https://i.postimg.cc/M6xrHsqs/wirecat-amo-logo.png"')
  })

  it.each(["/", "/connect/", "/connect/../server.mjs", "/static/connect/amo.html", "/webhooks/apps/b24-callback"])(
    "answers 404 to %s",
    async (path) => {
      const { base } = await start()
      expect((await fetch(`${base}${path}`)).status).toBe(404)
    },
  )
})
