import { afterEach, describe, expect, it, vi } from "vitest"
import { onRequest as claim } from "../functions/api/amo/claim"
import { onRequest as secrets } from "../functions/api/amo/secrets"
import { type AmoConnectKV, storageKey } from "../lib/amo-connect"

const STATE = `53682.${"a".repeat(20)}_${"B".repeat(20)}-9z`
const CLIENT_ID = "0f6c1d2e-3a4b-4c5d-8e9f-a0b1c2d3e4f5"
const SECRET = "s3cr3t-value-that-must-never-be-logged"

function fakeKV() {
  const store = new Map<string, { value: string; ttl: number }>()
  const kv: AmoConnectKV = {
    get: async (key) => store.get(key)?.value ?? null,
    put: async (key, value, { expirationTtl }) => {
      store.set(key, { value, ttl: expirationTtl })
    },
    delete: async (key) => {
      store.delete(key)
    },
  }
  return { kv, store }
}

const post = (body: string, contentType = "application/json", method = "POST") =>
  new Request("https://wirecat.dev/api/amo/x", {
    method,
    headers: { "Content-Type": contentType },
    body: method === "GET" ? undefined : body,
  })

const json = (value: unknown) => JSON.stringify(value)

afterEach(() => vi.restoreAllMocks())

describe("amo sign-in button Functions", () => {
  it("stores the webhook under the state's hash and hands it out once", async () => {
    const { kv, store } = fakeKV()
    const env = { AMO_CONNECT: kv }
    const stored = await secrets({
      request: post(json({ client_id: CLIENT_ID, client_secret: SECRET, state: STATE })),
      env,
    })
    expect(stored.status).toBe(200)
    expect(await stored.text()).toBe("")
    expect([...store.keys()]).toEqual([await storageKey(STATE)])
    expect([...store.keys()][0]).toMatch(/^amo:[0-9a-f]{64}$/)
    expect([...store.values()][0].ttl).toBe(600)

    const first = await claim({ request: post(json({ state: STATE })), env })
    expect(first.status).toBe(200)
    expect(first.headers.get("Cache-Control")).toBe("no-store")
    expect(await first.json()).toEqual({ client_id: CLIENT_ID, client_secret: SECRET })

    const second = await claim({ request: post(json({ state: STATE })), env })
    expect(second.status).toBe(404)
    expect(await second.json()).toEqual({ error: "not_ready" })
  })

  it("accepts a form-encoded webhook", async () => {
    const { kv, store } = fakeKV()
    const body = new URLSearchParams({ client_id: CLIENT_ID, client_secret: SECRET, state: STATE }).toString()
    const response = await secrets({
      request: post(body, "application/x-www-form-urlencoded"),
      env: { AMO_CONNECT: kv },
    })
    expect(response.status).toBe(200)
    expect(store.size).toBe(1)
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
    const log = vi.spyOn(console, "error").mockImplementation(() => {})
    const { kv, store } = fakeKV()
    const response = await secrets({ request: post(json(body)), env: { AMO_CONNECT: kv } })
    expect(response.status).toBe(400)
    expect(await response.text()).toBe("")
    expect(store.size).toBe(0)
    const logged = log.mock.calls.flat().join(" ")
    expect(logged).not.toContain(SECRET)
    expect(logged).not.toContain(CLIENT_ID)
    expect(logged).not.toContain("a".repeat(43))
  })

  it("refuses a body over the size limit", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { kv, store } = fakeKV()
    const body = json({ client_id: CLIENT_ID, client_secret: SECRET, state: STATE, pad: "x".repeat(5000) })
    const response = await secrets({ request: post(body), env: { AMO_CONNECT: kv } })
    expect(response.status).toBe(400)
    expect(store.size).toBe(0)
  })

  it("logs nothing on success", async () => {
    const log = vi.spyOn(console, "error")
    const { kv } = fakeKV()
    const env = { AMO_CONNECT: kv }
    await secrets({ request: post(json({ client_id: CLIENT_ID, client_secret: SECRET, state: STATE })), env })
    await claim({ request: post(json({ state: STATE })), env })
    expect(log).not.toHaveBeenCalled()
  })

  it("refuses a claim with a malformed state", async () => {
    const { kv } = fakeKV()
    const response = await claim({ request: post(json({ state: "nope" })), env: { AMO_CONNECT: kv } })
    expect(response.status).toBe(400)
  })

  it("answers 405 to other methods", async () => {
    const { kv } = fakeKV()
    for (const handler of [secrets, claim]) {
      const response = await handler({ request: post("", "text/plain", "GET"), env: { AMO_CONNECT: kv } })
      expect(response.status).toBe(405)
      expect(response.headers.get("Allow")).toBe("POST")
    }
  })

  it("answers 503 when the KV binding is missing", async () => {
    const body = json({ client_id: CLIENT_ID, client_secret: SECRET, state: STATE })
    expect((await secrets({ request: post(body), env: {} })).status).toBe(503)
    expect((await claim({ request: post(json({ state: STATE })), env: {} })).status).toBe(503)
  })
})
