export interface AmoConnectKV {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options: { expirationTtl: number }): Promise<void>
  delete(key: string): Promise<void>
}

export interface AmoConnectEnv {
  AMO_CONNECT?: AmoConnectKV
}

interface Context {
  request: Request
  env: AmoConnectEnv
}

const STATE = /^(\d{4,5})\.[A-Za-z0-9_-]{43,128}$/
const CLIENT_ID = /^[0-9A-Fa-f]{8}(-?[0-9A-Fa-f]{4}){3}-?[0-9A-Fa-f]{12}$/
const SECRET = /^[\x21-\x7e]{1,512}$/
const MAX_BODY = 4096
const TTL_SECONDS = 600

export function validState(state: unknown): state is string {
  if (typeof state !== "string") return false
  const match = STATE.exec(state)
  if (!match) return false
  const port = Number(match[1])
  return port >= 1024 && port <= 65535
}

export async function storageKey(state: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(state))
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
  return `amo:${hex}`
}

const reply = (status: number, body?: unknown, headers: Record<string, string> = {}) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
  })

const onlyPost = () => reply(405, { error: "method_not_allowed" }, { Allow: "POST" })

async function readFields(request: Request): Promise<Record<string, unknown> | null> {
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY) return null
  const text = await request.text()
  if (text.length > MAX_BODY) return null
  // amoCRM documents no body format for the secrets webhook, so both JSON and a form are accepted.
  try {
    const parsed: unknown = JSON.parse(text)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>
  } catch {}
  const form = new URLSearchParams(text)
  return form.size > 0 ? Object.fromEntries(form) : null
}

// Names only, never values: the first real webhook is the only way to learn amoCRM's field names if they differ.
function logRefusal(request: Request, fields: Record<string, unknown> | null) {
  const names = fields ? Object.keys(fields).filter((name) => /^[\w[\].-]{1,40}$/.test(name)) : []
  console.error(`amo secrets refused: content-type=${request.headers.get("Content-Type") ?? "none"} fields=${names}`)
}

export async function onSecrets({ request, env }: Context): Promise<Response> {
  if (request.method !== "POST") return onlyPost()
  const kv = env.AMO_CONNECT
  if (!kv) return reply(503)
  const fields = await readFields(request)
  const { client_id, client_secret, state } = fields ?? {}
  if (
    !validState(state) ||
    typeof client_id !== "string" ||
    !CLIENT_ID.test(client_id) ||
    typeof client_secret !== "string" ||
    !SECRET.test(client_secret)
  ) {
    logRefusal(request, fields)
    return reply(400)
  }
  await kv.put(await storageKey(state), JSON.stringify({ client_id, client_secret }), { expirationTtl: TTL_SECONDS })
  return reply(200)
}

export async function onClaim({ request, env }: Context): Promise<Response> {
  if (request.method !== "POST") return onlyPost()
  const kv = env.AMO_CONNECT
  if (!kv) return reply(503, { error: "unavailable" })
  const fields = await readFields(request)
  const state = fields?.state
  if (!validState(state)) return reply(400, { error: "bad_state" })
  const key = await storageKey(state)
  const stored = await kv.get(key)
  if (!stored) return reply(404, { error: "not_ready" })
  await kv.delete(key)
  const { client_id, client_secret } = JSON.parse(stored)
  return reply(200, { client_id, client_secret })
}
