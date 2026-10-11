import { gunzipSync } from "node:zlib"
import AxeBuilder from "@axe-core/playwright"
import { expect, type Page, type Request, test } from "@playwright/test"
import siteConfig from "../site.config.json" with { type: "json" }

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: landing does not download documentation until navigation`, async ({ page }) => {
    const requests: string[] = []
    page.on("request", (request) => requests.push(request.url()))
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(lang === "en" ? "/" : `/${lang}`)
    await expect(page.locator("[data-mini-query]")).toBeAttached()
    await page.waitForTimeout(1200)
    expect(requests.filter((url) => /\/docs\/|\/fonts\/docs-inter\//.test(url))).toEqual([])
    await page.locator(`.integration-table a[href="/${lang}/docs/tg"]`).click()
    await expect(page).toHaveURL(new RegExp(`/${lang}/docs/tg$`))
    await expect(page.locator("main h1")).toBeVisible()
    await expect.poll(() => requests.some((url) => url.includes("/fonts/docs-inter/"))).toBe(true)
  })
}

test("blocked analytics providers leave landing interactions usable", async ({ page, baseURL }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === "wirecat.dev") {
      await route.fulfill({ response: await route.fetch({ url: `${baseURL}${url.pathname}${url.search}` }) })
    } else if (url.hostname === "localhost") await route.continue()
    else await route.abort()
  })
  await page.goto("https://wirecat.dev/")
  await expect(page.locator("[data-mini-query]")).toBeAttached()
  await page.locator('.site-header nav a[href="/en/about"]').click()
  await expect(page.locator("h1")).toBeVisible()
  await expect(page).toHaveURL("https://wirecat.dev/en/about")
  expect(errors).toEqual([])
  await page.unrouteAll({ behavior: "ignoreErrors" })
})

for (const lang of ["en", "ru", "es"]) {
  for (const theme of ["light", "dark"] as const) {
    for (const path of ["architecture", "security"]) {
      test(`${lang}/${path}: mobile contrast in ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" })
        await page.goto(`/${lang}/docs/${path}`)
        await page.evaluate(() => document.fonts.ready)
        await expect(page.locator("h1")).toHaveCount(1)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
          .analyze()
        expect(result.violations, `${lang}/${path} ${theme}`).toEqual([])
      })
    }
  }
}

type Captured = { event: string; properties: Record<string, unknown> }
const posthogHost = (hostname: string) => hostname.endsWith(".posthog.com")
const realBrowser =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"

function capturedEvents(request: Request): Captured[] {
  const url = new URL(request.url())
  const raw = request.postDataBuffer()
  if (!raw || !/^\/(e|i\/v0\/e)\/?$/.test(url.pathname)) return []
  let text = (raw[0] === 0x1f && raw[1] === 0x8b ? gunzipSync(raw) : raw).toString()
  if (text.startsWith("data=")) text = Buffer.from(decodeURIComponent(text.slice(5)), "base64").toString()
  const body = JSON.parse(text)
  return Array.isArray(body) ? body : (body.batch ?? [body])
}

// Headless Chromium identifies itself as a bot, and PostHog drops bot events, so the page sees a regular browser.
async function productionSite(page: Page, baseURL: string | undefined, events: Captured[] = []) {
  await page.context().route("**/*", async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === "wirecat.dev") {
      await route.fulfill({ response: await route.fetch({ url: `${baseURL}${url.pathname}${url.search}` }) })
    } else if (posthogHost(url.hostname)) {
      events.push(...capturedEvents(route.request()))
      const replay = url.pathname.endsWith("/config") || url.pathname.startsWith("/flags")
      await route.fulfill({
        contentType: url.pathname.endsWith(".js") ? "application/javascript" : "application/json",
        body: replay ? '{"featureFlags":{},"sessionRecording":{"endpoint":"/s/"}}' : "{}",
      })
    } else if (url.hostname === "localhost") await route.continue()
    else await route.abort()
  })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false })
    Object.defineProperty(navigator, "userAgentData", {
      get: () => ({ brands: [{ brand: "Chromium", version: "140" }] }),
    })
  })
}

const browserStorage = (page: Page) =>
  page.evaluate(() => ({
    cookies: document.cookie,
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  }))

test("without a PostHog project key the site loads no analytics and asks nothing", async ({ page, baseURL }) => {
  test.skip(siteConfig.analytics.posthogKey !== "", "a project key is configured")
  const providers: string[] = []
  page.on("request", (request) => {
    if (posthogHost(new URL(request.url()).hostname)) providers.push(request.url())
  })
  await productionSite(page, baseURL)
  await page.goto("https://wirecat.dev/")
  await expect(page.locator("[data-mini-query]")).toBeAttached()
  await page.waitForTimeout(1500)
  expect(providers).toEqual([])
  await expect(page.locator("[data-consent-banner]")).toHaveCount(0)
  await expect(page.locator("[data-consent-settings]")).toBeHidden()
  expect(await browserStorage(page)).toEqual({ cookies: "", local: [], session: [] })
  await page.context().unrouteAll({ behavior: "ignoreErrors" })
})

test.describe("with a PostHog project key", () => {
  test.skip(siteConfig.analytics.posthogKey === "", "no project key in site.config.json")
  test.use({ userAgent: realBrowser })

  test("unanswered visitors are counted without browser storage; Accept adds identity and recording", async ({
    page,
    baseURL,
  }) => {
    const events: Captured[] = []
    const recorder: string[] = []
    page.on("request", (request) => {
      if (request.url().includes("recorder")) recorder.push(request.url())
    })
    await productionSite(page, baseURL, events)
    await page.goto("https://wirecat.dev/")
    await expect(page.locator("[data-consent-banner]")).toBeVisible()
    await expect.poll(() => events.some((event) => event.event === "$pageview")).toBe(true)
    expect(events.every((event) => event.properties.$cookieless_mode === true)).toBe(true)
    expect(await browserStorage(page)).toEqual({ cookies: "", local: [], session: [] })
    expect(recorder).toEqual([])

    await page.locator("[data-consent-banner] button").first().click()
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0)
    await expect.poll(() => recorder.length).toBeGreaterThan(0)
    expect((await browserStorage(page)).local).toEqual(
      expect.arrayContaining([expect.stringMatching(/^__ph_opt_in_out_/)]),
    )

    await page.reload()
    await expect(page.locator("[data-mini-query]")).toBeAttached()
    await page.waitForTimeout(1500)
    await expect(page.locator("[data-consent-banner]")).toHaveCount(0)
    await page.locator("[data-consent-settings]").click()
    await page.locator("[data-consent-banner] button").nth(1).click()
    expect(await browserStorage(page)).toEqual({
      cookies: "",
      local: [expect.stringMatching(/^__ph_opt_in_out_/)],
      session: [],
    })
    await page.context().unrouteAll({ behavior: "ignoreErrors" })
  })

  for (const lang of ["en", "ru", "es"]) {
    test(`${lang}: installation intent events count successful copies and guide opens without clipboard text`, async ({
      page,
      baseURL,
    }) => {
      const events: Captured[] = []
      await productionSite(page, baseURL, events)
      await page.addInitScript(() => {
        const browser = window as typeof window & { failAuditCopy?: boolean }
        Object.defineProperty(navigator, "clipboard", {
          value: {
            writeText: async () => {
              if (browser.failAuditCopy) throw new Error("Copy denied")
            },
          },
        })
      })
      const intents = () =>
        events
          .filter((event) => ["installation_command_copy", "setup_guide_open"].includes(event.event))
          .map((event) => [event.event, event.properties.tool, event.properties.locale, event.properties.surface])
      await page.goto(`https://wirecat.dev${lang === "en" ? "/" : `/${lang}`}`)
      await expect(page.locator("[data-consent-banner]")).toBeVisible()
      await page.locator(".hero [data-connect]>summary").click()
      await page.locator(".hero .copy-agent").click()
      await expect.poll(intents).toEqual([["installation_command_copy", "tg", lang, "hero"]])
      await page.evaluate(() => {
        ;(window as typeof window & { failAuditCopy?: boolean }).failAuditCopy = true
      })
      await page.locator(".hero .copy-agent").click()
      await page.waitForTimeout(500)
      expect(intents()).toHaveLength(1)
      await page.locator(".hero .connect-guide").first().click()
      await expect(page).toHaveURL(`https://wirecat.dev/${lang}/docs/installation#tg`)
      await expect.poll(intents).toContainEqual(["setup_guide_open", "tg", lang, "hero"])
      expect(JSON.stringify(events)).not.toContain("npm install")
      await page.context().unrouteAll({ behavior: "ignoreErrors" })
    })
  }
})
