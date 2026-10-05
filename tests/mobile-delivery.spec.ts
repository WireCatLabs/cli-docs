import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: landing does not download documentation until navigation`, async ({ page }) => {
    const requests: string[] = []
    page.on("request", (request) => requests.push(request.url()))
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}`)
    await expect(page.locator(".sp-input")).toBeEditable()
    await page.waitForTimeout(1200)
    expect(requests.filter((url) => /\/docs\/|\/fonts\/docs-inter\//.test(url))).toEqual([])
    await page.locator(`.site-header nav a[href="/${lang}/docs/tg"]`).click()
    await expect(page).toHaveURL(new RegExp(`/${lang}/docs/tg$`))
    await expect(page.locator("main h1")).toBeVisible()
    await expect.poll(() => requests.some((url) => url.includes("/fonts/docs-inter/"))).toBe(true)
  })
}

test("analytics queues initial views and navigation before idle provider downloads", async ({ page, baseURL }) => {
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
  await page.goto("https://wirecat.dev/en")
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
  expect(new URL(initialConfig.page_location).pathname).toBe("/en")
  expect(providers).toEqual([])
  await page.locator('.site-header nav a[href="/en/about"]').click()
  await expect(page).toHaveURL("https://wirecat.dev/en/about")
  await expect.poll(async () => (await queued()).ym.filter((item) => item[1] === "hit").length).toBe(2)
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
  await page.goto("https://wirecat.dev/en")
  await expect(page.locator(".sp-input")).toBeEditable()
  await page.locator('.site-header nav a[href="/en/about"]').click()
  await expect(page.locator("h1")).toBeVisible()
  await expect(page).toHaveURL("https://wirecat.dev/en/about")
  expect(errors).toEqual([])
  await page.unrouteAll({ behavior: "ignoreErrors" })
})

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: shared architecture and security pages retain mobile contrast in both themes`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" })
      for (const path of ["architecture", "security"]) {
        await page.goto(`/${lang}/docs/${path}`)
        await page.evaluate(() => document.fonts.ready)
        await expect(page.locator("h1")).toHaveCount(1)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
          .analyze()
        expect(result.violations, `${lang}/${path} ${theme}`).toEqual([])
      }
    }
  })
}
