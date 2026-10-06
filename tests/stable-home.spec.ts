import { expect, test } from "@playwright/test"

test("English root is complete and stable with JavaScript disabled and non-English preferences", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, locale: "ru-RU" })
  await context.route("https://mc.yandex.ru/**", (route) => route.abort())
  const page = await context.newPage()
  await page.goto("/")
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
  await expect(page.locator("main h1")).toContainText(/never search/i)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/wirecat\.dev\/?$/)
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", /^https:\/\/wirecat\.dev\/?$/)
  await expect(page.locator('script[src="/language.js"]')).toHaveCount(0)
  await expect(page.locator('.site-header .lang-menu a[href="/ru"]')).toHaveCount(1)
  await context.close()
})

test("legacy English home redirects permanently without catching English subpages", async ({ request }) => {
  const redirect = await request.get("/en", { maxRedirects: 0 })
  expect(redirect.status()).toBe(301)
  expect(redirect.headers().location).toBe("/")
  expect((await request.get("/en/docs/installation")).status()).toBe(200)
  expect((await request.get("/en/about")).status()).toBe(200)
})

test("demo choices and return-home navigation keep the URL clean", async ({ page }) => {
  await page.goto("/?scenario=commitments&messenger=max#search-playground")
  await expect(page.locator(".sp-input")).toBeEditable()
  await expect.poll(() => new URL(page.url()).search).toBe("")
  expect(new URL(page.url()).hash).toBe("#search-playground")
  await page.locator(".session").nth(1).click()
  await page.locator('[data-messenger="max"]').click()
  expect(new URL(page.url()).search).toBe("")
  await page.locator('.site-header nav a[href="/en/about"]').click()
  await page.locator(".site-header .site-brand").click()
  await expect(page).toHaveURL(/\/$/)
  await page.locator(".site-header .lang summary").click()
  await page.locator('.site-header .lang-menu a[href="/ru"]').click()
  await expect(page).toHaveURL(/\/ru$/)
  await page.locator(".site-header .lang summary").click()
  await page.locator('.site-header .lang-menu a[href="/"]').click()
  await expect(page).toHaveURL(/\/$/)
})
