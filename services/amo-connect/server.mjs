import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { createServer } from "node:http"
import { fileURLToPath } from "node:url"

const STATE = /^(\d{4,5})\.[A-Za-z0-9_-]{43,128}$/
const CLIENT_ID = /^[0-9A-Fa-f]{8}(-?[0-9A-Fa-f]{4}){3}-?[0-9A-Fa-f]{12}$/
const SECRET = /^[\x21-\x7e]{1,512}$/
const MAX_BODY = 4096
const TTL_MS = 600_000
const MAX_ENTRIES = 1000

const PAGE_CSP =
  "default-src 'none'; script-src 'self' https://www.amocrm.ru; style-src 'unsafe-inline'; base-uri 'none'; " +
  "form-action 'none'; frame-ancestors 'none'"
const CALLBACK_CSP =
  "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; " +
  "frame-ancestors 'none'"
const DATA_CSP = "default-src 'none'; frame-ancestors 'none'"

const SECURITY = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow",
}

const STATIC = {
  "/connect/amo.html": ["connect/amo.html", "text/html; charset=utf-8", PAGE_CSP, "no-cache"],
  "/connect/amo.js": ["connect/amo.js", "text/javascript; charset=utf-8", DATA_CSP, "no-cache"],
  "/connect/wirecat-amo-logo.png": ["connect/wirecat-amo-logo.png", "image/png", DATA_CSP, "public, max-age=86400"],
  "/webhooks/apps/amo-callback": [
    "webhooks/apps/amo-callback.html",
    "text/html; charset=utf-8",
    CALLBACK_CSP,
    "no-cache",
  ],
  "/webhooks/apps/amo-callback.js": [
    "webhooks/apps/amo-callback.js",
    "text/javascript; charset=utf-8",
    DATA_CSP,
    "no-cache",
  ],
}

// Read once at start, so a request path never reaches the file system.
const loadStatic = (dir) =>
  new Map(
    Object.entries(STATIC).map(([route, [file, type, csp, cache]]) => [
      route,
      { body: readFileSync(new URL(file, dir)), type, csp, cache },
    ]),
  )

export const validState = (state) => {
  if (typeof state !== "string") return false
  const match = STATE.exec(state)
  if (!match) return false
  const port = Number(match[1])
  return port >= 1024 && port <= 65535
}

// A leaked store or core dump then holds no state that could claim the keys.
export const storageKey = (state) => createHash("sha256").update(state).digest("hex")

export const createStore = ({ now = Date.now, ttlMs = TTL_MS, maxEntries = MAX_ENTRIES } = {}) => {
  const entries = new Map()
  const sweep = () => {
    const time = now()
    for (const [key, entry] of entries) {
      if (entry.expires > time) break
      entries.delete(key)
    }
  }
  return {
    put(key, value) {
      sweep()
      entries.delete(key)
      if (entries.size >= maxEntries) return false
      entries.set(key, { value, expires: now() + ttlMs })
      return true
    },
    take(key) {
      const entry = entries.get(key)
      entries.delete(key)
      return entry && entry.expires > now() ? entry.value : undefined
    },
    keys() {
      sweep()
      return [...entries.keys()]
    },
  }
}

const send = (res, status, { body, type, csp = DATA_CSP, cache = "no-store", headers = {} } = {}) => {
  res.writeHead(status, {
    ...SECURITY,
    "Content-Security-Policy": csp,
    "Cache-Control": cache,
    ...(type ? { "Content-Type": type } : {}),
    "Content-Length": body ? Buffer.byteLength(body) : 0,
    ...headers,
  })
  res.end(res.req.method === "HEAD" ? undefined : body)
}

const sendJson = (res, status, value, headers) =>
  send(res, status, { body: JSON.stringify(value), type: "application/json", headers })

// Stops collecting past the cap; the reply then closes the connection, so the rest is never read.
const readBody = (req) =>
  new Promise((resolve) => {
    if (Number(req.headers["content-length"] ?? 0) > MAX_BODY) return resolve(null)
    const chunks = []
    let size = 0
    req.on("data", (chunk) => {
      size += chunk.length
      if (size <= MAX_BODY) chunks.push(chunk)
      else resolve(null)
    })
    req.on("end", () => resolve(size > MAX_BODY ? null : Buffer.concat(chunks).toString("utf8")))
    req.on("error", () => resolve(null))
  })

// amoCRM documents no body format for the secrets webhook, so both JSON and a form are accepted.
const parseFields = (text) => {
  if (text === null) return null
  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed
  } catch {}
  const form = new URLSearchParams(text)
  return form.size > 0 ? Object.fromEntries(form) : null
}

// Names only, never values: the first real webhook is the only way to learn amoCRM's field names if they differ.
const logRefusal = (log, req, fields) => {
  const names = fields ? Object.keys(fields).filter((name) => /^[\w[\].-]{1,40}$/.test(name)) : []
  log(`amo secrets refused: content-type=${req.headers["content-type"] ?? "none"} fields=${names}`)
}

const onSecrets = async (req, res, { store, log }) => {
  const fields = parseFields(await readBody(req))
  const { client_id, client_secret, state } = fields ?? {}
  if (
    !validState(state) ||
    typeof client_id !== "string" ||
    !CLIENT_ID.test(client_id) ||
    typeof client_secret !== "string" ||
    !SECRET.test(client_secret)
  ) {
    logRefusal(log, req, fields)
    return send(res, 400, { headers: { Connection: "close" } })
  }
  if (!store.put(storageKey(state), { client_id, client_secret })) {
    log("amo secrets refused: the store is full")
    return send(res, 503)
  }
  send(res, 200)
}

const onClaim = async (req, res, { store }) => {
  const fields = parseFields(await readBody(req))
  const state = fields?.state
  if (!validState(state)) return sendJson(res, 400, { error: "bad_state" }, { Connection: "close" })
  const stored = store.take(storageKey(state))
  if (!stored) return sendJson(res, 404, { error: "not_ready" })
  sendJson(res, 200, stored)
}

const API = { "/api/amo/secrets": onSecrets, "/api/amo/claim": onClaim }

export const createAmoConnect = ({
  store = createStore(),
  log = console.error,
  staticDir = new URL("./static/", import.meta.url),
} = {}) => {
  const files = loadStatic(staticDir)
  const server = createServer(async (req, res) => {
    const path = new URL(req.url ?? "/", "http://localhost").pathname
    const api = API[path]
    if (api) {
      if (req.method !== "POST") return sendJson(res, 405, { error: "method_not_allowed" }, { Allow: "POST" })
      return api(req, res, { store, log })
    }
    const file = files.get(path)
    if (!file) return send(res, 404)
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, { headers: { Allow: "GET, HEAD" } })
    send(res, 200, file)
  })
  // A small container: slow or idle clients must not hold memory.
  server.headersTimeout = 10_000
  server.requestTimeout = 15_000
  server.keepAliveTimeout = 5_000
  return server
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 8080)
  createAmoConnect().listen(port, () => console.error(`amo-connect listening on ${port}`))
  // As PID 1 in the container, node ignores SIGTERM without a handler and `docker stop` waits 10 s.
  process.on("SIGTERM", () => process.exit(0))
}
