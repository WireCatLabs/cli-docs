import { afterEach, describe, expect, it, vi } from "vitest"
import { apiSource, errorCode } from "../lib/ideas/api.ts"
import { maskEmail, returnPath, safeReturnPath } from "../lib/ideas/config.ts"
import { IdeasError } from "../lib/ideas/types.ts"
import { ideasWords } from "../lib/ideas/words.ts"

const base = "https://api.wirecat.dev"
const apiIdea = {
  id: 12,
  title: "Slack",
  body: "Read Slack messages.",
  tool: "other",
  status: "not_planned",
  status_reason: "Slack's terms do not allow it.",
  answer: null,
  links: [{ url: "https://github.com/WireCatLabs/max-cli/pull/90", label: "PR" }],
  votes_count: 14,
  voted: false,
  hidden: false,
  merged_into_id: null,
  author: { name: null, team: false },
  status_changed_at: null,
  created_at: "2026-11-02T09:00:00Z",
}

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status })
const failure = (status: number, code: string) => json(status, { error: { code, message: code } })

function client(...responses: Response[]) {
  const fetcher = vi.fn<typeof fetch>()
  for (const response of responses) fetcher.mockResolvedValueOnce(response)
  return { source: apiSource(`${base}/`, fetcher), fetcher }
}
const request = (fetcher: ReturnType<typeof vi.fn<typeof fetch>>, index = 0) => {
  const [url, init] = fetcher.mock.calls[index]
  return { url: String(url), init: init ?? {}, body: init?.body ? JSON.parse(String(init.body)) : undefined }
}
const rejection = async (promise: Promise<unknown>) => {
  try {
    await promise
  } catch (error) {
    return error instanceof IdeasError ? error.code : "not an IdeasError"
  }
  return "resolved"
}

describe("ideas API client", () => {
  it("lists a page with filters and sends the session cookie", async () => {
    const { source, fetcher } = client(json(200, { ideas: [apiIdea], meta: { page: 2, per_page: 20, total: 41 } }))
    const page = await source.list({ tool: "other", status: "not_planned", sort: "new", page: 2 })
    const { url, init } = request(fetcher)
    expect(url).toBe(`${base}/v1/ideas?tool=other&status=not_planned&sort=new&page=2&per_page=20`)
    expect(init).toMatchObject({ method: "GET", credentials: "include" })
    expect(page).toMatchObject({ total: 41, page: 2, perPage: 20 })
    expect(page.ideas[0]).toEqual({
      id: "12",
      title: "Slack",
      body: "Read Slack messages.",
      tool: "other",
      status: "not_planned",
      statusReason: "Slack's terms do not allow it.",
      answer: null,
      links: [{ url: "https://github.com/WireCatLabs/max-cli/pull/90", label: "PR" }],
      votes: 14,
      voted: false,
      author: { name: null, team: false },
      mergedIntoId: null,
      createdAt: "2026-11-02T09:00:00Z",
    })
  })

  it("answers null for an unknown idea and keeps a merged one with where it went", async () => {
    const { source } = client(failure(404, "not_found"), json(200, { idea: { ...apiIdea, merged_into_id: 7 } }))
    expect(await source.get("99")).toBeNull()
    expect((await source.get("12"))?.mergedIntoId).toBe("7")
  })

  it("posts an idea as JSON with the Turnstile token", async () => {
    const { source, fetcher } = client(json(201, { idea: { ...apiIdea, votes_count: 1, voted: true } }))
    const idea = await source.create({ title: "Slack support", body: "", tool: "other", turnstileToken: "t" })
    const { init, body } = request(fetcher)
    expect(init).toMatchObject({
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
    expect(body).toEqual({ idea: { title: "Slack support", body: "", tool: "other" }, turnstile_token: "t" })
    expect(idea).toMatchObject({ votes: 1, voted: true })
  })

  it("votes, takes it back and reports the conflicts", async () => {
    const { source, fetcher } = client(
      json(201, { idea: { id: 12, votes_count: 15, voted: true } }),
      json(200, { idea: { id: 12, votes_count: 14, voted: false } }),
      failure(409, "already_voted"),
      failure(422, "idea_merged"),
    )
    expect(await source.vote("12")).toEqual({ votes: 15, voted: true })
    expect(await source.unvote("12")).toEqual({ votes: 14, voted: false })
    expect(request(fetcher, 1).init.method).toBe("DELETE")
    expect(await rejection(source.vote("12"))).toBe("already_voted")
    expect(await rejection(source.vote("12"))).toBe("idea_merged")
  })

  it("skips the similar search under 3 characters", async () => {
    const { source, fetcher } = client(json(200, { ideas: [apiIdea] }))
    expect(await source.similar("sl")).toEqual([])
    expect(fetcher).not.toHaveBeenCalled()
    expect(await source.similar("slack sup")).toHaveLength(1)
    expect(request(fetcher).url).toBe(`${base}/v1/ideas/similar?q=slack+sup`)
  })

  it("reads the session, and a 401 means signed out", async () => {
    const { source } = client(
      json(200, { member: { id: "u", email: "ann@example.com", name: null, locale: "ru", admin: false } }),
      failure(401, "sign_in_required"),
    )
    expect(await source.member()).toEqual({ email: "ann@example.com", name: null })
    expect(await source.member()).toBeNull()
  })

  it("sends the sign-in link request, the token, sign out, account deletion and unsubscribe", async () => {
    const { source, fetcher } = client(
      json(202),
      json(201, { member: {}, return_to: "/ru/ideas/idea?id=12" }),
      json(204),
      json(204),
      json(204),
    )
    await source.requestSignInLink({ email: "a@b.c", locale: "ru", returnTo: "/ru/ideas", turnstileToken: "t" })
    expect(request(fetcher, 0).body).toEqual({
      sign_in_link: { email: "a@b.c", locale: "ru", return_to: "/ru/ideas" },
      turnstile_token: "t",
    })
    expect(await source.startSession("tok")).toEqual({ returnTo: "/ru/ideas/idea?id=12" })
    expect(request(fetcher, 1)).toMatchObject({ url: `${base}/v1/sessions`, body: { token: "tok" } })
    await source.signOut()
    await source.deleteAccount()
    await source.unsubscribe("u-tok")
    expect([2, 3, 4].map((index) => [request(fetcher, index).init.method, request(fetcher, index).url])).toEqual([
      ["DELETE", `${base}/v1/sessions`],
      ["DELETE", `${base}/v1/member`],
      ["DELETE", `${base}/v1/subscriptions`],
    ])
    expect(request(fetcher, 4).body).toEqual({ token: "u-tok" })
  })

  it("builds the Google URL and reports Google not set up before navigating", async () => {
    const { source, fetcher } = client(failure(503, "google_unavailable"), json(302))
    expect(source.googleSignInUrl("ru", "/ru/ideas/idea?id=12")).toBe(
      `${base}/v1/google_sign_ins/new?locale=ru&return_to=%2Fru%2Fideas%2Fidea%3Fid%3D12`,
    )
    expect(await rejection(source.googleSignInReady("ru", "/ru/ideas"))).toBe("sign_in_unavailable")
    expect(request(fetcher).init).toMatchObject({ credentials: "include", redirect: "manual" })
    expect(await rejection(source.googleSignInReady("ru", "/ru/ideas"))).toBe("resolved")
  })

  it("treats no answer and server errors as the API being down", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValueOnce(new TypeError("offline"))
    fetcher.mockResolvedValueOnce(new Response("<html>bad gateway</html>", { status: 502 }))
    const source = apiSource(base, fetcher)
    expect(await rejection(source.list({ sort: "top" }))).toBe("unavailable")
    expect(await rejection(source.list({ sort: "top" }))).toBe("unavailable")
  })
})

describe("API error codes", () => {
  it.each([
    [503, "mail_unavailable", "sign_in_unavailable"],
    [503, "google_unavailable", "sign_in_unavailable"],
    [500, "", "unavailable"],
    [401, "sign_in_required", "sign_in_required"],
    [403, "turnstile_failed", "turnstile_failed"],
    [403, "forbidden_origin", "forbidden"],
    [404, "not_voted", "not_voted"],
    [409, "already_voted", "already_voted"],
    [422, "invalid_sign_in_token", "invalid_token"],
    [422, "invalid_unsubscribe_token", "invalid_token"],
    [422, "validation_error", "validation_error"],
    [429, "idea_limit", "idea_limit"],
    [429, "rate_limited", "rate_limited"],
  ])("%i %s is %s", (status, code, expected) => {
    expect(errorCode(status, code)).toBe(expected)
  })
})

describe("sign-in return paths", () => {
  it("keeps the page and its filters, without the page's own markers", () => {
    expect(returnPath("ru", "/ru/ideas/idea", "?id=12&preview=down&sign_in_error=google_failed")).toBe(
      "/ru/ideas/idea?id=12",
    )
    expect(returnPath("en", "/en/ideas", "?tool=tg&status=planned")).toBe("/en/ideas?tool=tg&status=planned")
  })

  it("refuses anything the API would refuse", () => {
    for (const path of [
      "https://evil.example/en/ideas",
      "//evil.example",
      "/en/ideas/../x",
      "/ru/ideas",
      "/en/ideas?q=a/b",
    ])
      expect(safeReturnPath("en", path)).toBe("/en/ideas")
    expect(safeReturnPath("en", "/en/ideas/new")).toBe("/en/ideas/new")
  })
})

describe("who is signed in", () => {
  it("masks the address but keeps it recognisable", () => {
    expect(maskEmail("ann@example.com")).toBe("a•••@e•••.com")
    expect(maskEmail("viacheslav@mail.example.ru")).toBe("vi•••@m•••.ru")
  })

  it.each(["en", "ru", "es"])("has every Google sign-in error in %s", (lang) => {
    expect(Object.keys(ideasWords(lang).google).sort()).toEqual([
      "google_cancelled",
      "google_expired",
      "google_failed",
      "google_use_email",
    ])
  })
})

describe("API address", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  async function configWith(nodeEnv: string, apiUrl: string) {
    vi.stubEnv("NODE_ENV", nodeEnv)
    vi.stubEnv("NEXT_PUBLIC_IDEAS_API_URL", apiUrl)
    vi.resetModules()
    return import("../lib/ideas/config.ts")
  }

  it("takes NEXT_PUBLIC_IDEAS_API_URL in development, so the local page talks to the local API", async () => {
    const config = await configWith("development", "http://localhost:3000")
    expect(config).toMatchObject({ ideasApiUrl: "http://localhost:3000", ideasLive: true, ideasSample: false })
  })

  it("ignores it in a build, where no apiUrl in site.config.json still hides the page", async () => {
    const config = await configWith("production", "http://localhost:3000")
    expect(config).toMatchObject({ ideasApiUrl: "", ideasLive: false, ideasEnabled: false })
  })
})
