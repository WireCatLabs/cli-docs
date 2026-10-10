import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

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

test("analytics initializes one view per document before idle provider downloads", async ({ page, baseURL }) => {
  const providers: string[] = []
  await page.context().route("**/*", async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === "wirecat.dev") {
      const response = await route.fetch({ url: `${baseURL}${url.pathname}${url.search}` })
      await route.fulfill({ response })
    } else if (["mc.yandex.ru", "www.googletagmanager.com"].includes(url.hostname)) {
      providers.push(url.hostname)
      await route.fulfill({ contentType: "application/javascript", body: "/* No live analytics traffic. */" })
    } else if (url.hostname === "localhost") {
      await route.continue()
    } else {
      await route.abort()
    }
  })
  await page.addInitScript(() => {
    const browser = window as typeof window & { auditIdleCallbacks: IdleRequestCallback[] }
    browser.auditIdleCallbacks = []
    window.requestIdleCallback = (callback) => browser.auditIdleCallbacks.push(callback)
  })
  await page.goto("https://wirecat.dev/")
  const queued = () =>
    page.evaluate(() => {
      const browser = window as typeof window & { ym?: { a?: IArguments[] }; dataLayer?: IArguments[] }
      return {
        ym: (browser.ym?.a ?? []).map((item) => Array.from(item)),
        ga: (browser.dataLayer ?? []).map((item) => Array.from(item)),
      }
    })
  await expect.poll(async () => (await queued()).ym.filter((item) => item[1] === "hit").length).toBe(1)
  const initialConfig = (await queued()).ga.find((item) => item[0] === "config")?.[2] as { page_location: string }
  expect(new URL(initialConfig.page_location).pathname).toBe("/")
  expect(providers).toEqual([])
  await page.locator('.site-header nav a[href="/en/about"]').click()
  await expect(page).toHaveURL("https://wirecat.dev/en/about")
  await expect.poll(async () => (await queued()).ym.filter((item) => item[1] === "hit").length).toBe(1)
  expect(new URL(String((await queued()).ym.find((item) => item[1] === "hit")?.[2])).pathname).toBe("/en/about")
  expect((await queued()).ga.filter((item) => item[0] === "config")).toHaveLength(1)
  expect(providers).toEqual([])
  await page.evaluate(() => {
    const browser = window as typeof window & { auditIdleCallbacks: IdleRequestCallback[] }
    for (const callback of browser.auditIdleCallbacks.splice(0))
      callback({ didTimeout: false, timeRemaining: () => 50 })
  })
  await expect.poll(() => providers.length).toBe(2)
  expect(providers.sort()).toEqual(["mc.yandex.ru", "www.googletagmanager.com"])
  await page.reload()
  await expect.poll(async () => (await queued()).ym.filter((item) => item[1] === "hit").length).toBe(1)
  expect((await queued()).ga.filter((item) => item[0] === "config")).toHaveLength(1)
  await page.context().unrouteAll({ behavior: "ignoreErrors" })
})

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

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: installation intent events count successful copies and guide opens without clipboard text`, async ({
    page,
    baseURL,
  }) => {
    await page.context().route("**/*", async (route) => {
      const url = new URL(route.request().url())
      if (url.hostname === "wirecat.dev") {
        await route.fulfill({ response: await route.fetch({ url: `${baseURL}${url.pathname}${url.search}` }) })
      } else if (url.hostname === "localhost") await route.continue()
      else await route.abort()
    })
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
    await page.goto(`https://wirecat.dev${lang === "en" ? "/" : `/${lang}`}`)
    await expect
      .poll(() =>
        page.evaluate(() => (window as typeof window & { wirecatTrackingReady?: boolean }).wirecatTrackingReady),
      )
      .toBe(true)
    const events = () =>
      page.evaluate(() => {
        const browser = window as typeof window & { dataLayer?: IArguments[]; ym?: { a?: IArguments[] } }
        return {
          ga: (browser.dataLayer ?? []).map((item) => Array.from(item)).filter((item) => item[0] === "event"),
          ym: (browser.ym?.a ?? []).map((item) => Array.from(item)).filter((item) => item[1] === "reachGoal"),
        }
      })
    await page.locator(".hero [data-connect]>summary").click()
    await page.locator(".hero .copy-agent").click()
    expect((await events()).ga).toEqual([
      ["event", "installation_command_copy", { tool: "tg", locale: lang, surface: "hero" }],
    ])
    await page.evaluate(() => {
      ;(window as typeof window & { failAuditCopy?: boolean }).failAuditCopy = true
    })
    await page.locator(".hero .copy-agent").click()
    expect((await events()).ga).toHaveLength(1)
    await page.evaluate(() => {
      ;(window as typeof window & { failAuditCopy?: boolean }).failAuditCopy = false
    })
    await page.locator(".hero .copy-agent").click()
    expect((await events()).ga).toHaveLength(2)
    expect((await events()).ym).toHaveLength(2)
    if (lang === "en")
      await page.evaluate(() => {
        ;(window as typeof window & { wirecatTrackingReady?: boolean }).wirecatTrackingReady = false
      })
    await page.locator(".hero .connect-guide").first().click()
    await expect(page).toHaveURL(`https://wirecat.dev/${lang}/docs/installation#tg`)
    const guideIndex = lang === "en" ? 0 : 2
    await expect
      .poll(async () => (await events()).ga[guideIndex])
      .toEqual(["event", "setup_guide_open", { tool: "tg", locale: lang, surface: "hero" }])
    const beforeGenericCopy = await events()
    await page.locator("main .docs-prompt").filter({ hasText: "WireCat" }).first().locator("button.docs-copy").click()
    expect(await events()).toEqual(beforeGenericCopy)
    await page.locator(`main a[href="/${lang}/docs/tg/installation"]`).first().click()
    await expect(page).toHaveURL(`https://wirecat.dev/${lang}/docs/tg/installation`)
    await page.locator("main details#tg > summary").click()
    const install = page.locator("main .docs-prompt").filter({ hasText: "@wirecat/tg-cli" })
    await install.locator("button.docs-copy").click()
    expect((await events()).ga[guideIndex + 1]).toEqual([
      "event",
      "installation_command_copy",
      { tool: "tg", locale: lang, surface: "installation" },
    ])
    expect((await events()).ym).toHaveLength(lang === "en" ? 2 : 4)
    expect(JSON.stringify(await events())).not.toContain("npm")
    await page.context().unrouteAll({ behavior: "ignoreErrors" })
  })
}
