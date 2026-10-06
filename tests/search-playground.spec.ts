import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: live results, source context, zero hits and no unsupported summary`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(lang === "en" ? "/" : `/${lang}`)
    const demo = page.locator("#search-playground")
    await expect(demo.locator(".sp-hit")).toHaveCount(18)
    const query = demo.locator(".sp-input")
    await query.fill('text:"not approved"')
    await expect(demo.locator(".sp-hit")).toHaveCount(1)
    await demo.locator(".sp-hit").first().click()
    await expect(demo.locator(".sp-context-title")).toContainText("Client studio")
    await expect(demo.locator(".sp-message")).toHaveCount(5)
    await demo.locator(".sp-detail-bar").getByRole("button").nth(2).click()
    await expect(demo.locator(".sp-summary article")).toHaveCount(1)
    await expect(demo.locator(".sp-summary blockquote")).toContainText("not approved")
    await query.fill("nothingwillmatch")
    await expect(demo.locator(".sp-empty")).toBeVisible()
    await expect(demo.locator(".sp-summary article")).toHaveCount(0)
    await query.fill("filename:*.pdf")
    await expect(query).toHaveAttribute("aria-invalid", "true")
    await expect(demo.locator(".sp-copy")).toBeDisabled()
    expect(errors).toEqual([])
  })
}
test("keyboard completion quotes a value and retains the remainder of a query", async ({ page }) => {
  await page.goto("/")
  const query = page.locator(".sp-input")
  await query.fill("Atlas chat:Clien")
  await expect(page.locator(".sp-suggestion")).toHaveCount(1)
  await query.press("ArrowDown")
  await query.press("Enter")
  await expect(query).toHaveValue('Atlas chat:"Client studio"')
  await expect(page.locator(".sp-hit")).toHaveCount(7)
  await query.fill("Atlas ch")
  await expect(page.locator(".sp-empty")).toBeVisible()
  await query.press("ArrowDown")
  await expect(page.locator(".sp-popup")).toBeVisible()
  await expect(page.locator(".sp-suggestion")).toHaveCount(1)
  await query.press("Enter")
  await expect(query).toHaveValue("Atlas chat:")
  await query.press("Escape")
  await expect(page.locator(".sp-popup")).not.toBeVisible()
})
test("mobile has no horizontal overflow; theme and reduced motion remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" })
  await page.goto("/ru")
  await page.locator("#search-playground").scrollIntoViewIfNeeded()
  await expect(page.locator(".sp-hit")).toHaveCount(18)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole("button", { name: "Файлы +", exact: true }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(2)
  await page.locator("#bar .theme-toggle").click()
  await expect(page.locator(".sp-heading")).toBeVisible()
  await page.locator("#search-playground").screenshot({ path: "/tmp/search-playground-mobile.png" })
})

test("filter shortcuts open their suggestions and clipboard copies the actual query", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/")
  await page.getByRole("button", { name: "Chat +", exact: true }).click()
  await expect(page.locator(".sp-suggestion")).toHaveCount(6)
  await page.locator(".sp-suggestion").filter({ hasText: "Client studio" }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(7)
  await page.locator(".sp-copy").click()
  const command = await page.evaluate(() => navigator.clipboard.readText())
  expect(command).toContain('chat:"Client studio"')
  expect(command).toContain("--timezone UTC")
})

test("search controls and results meet automated accessibility checks in both themes", async ({ page }) => {
  await page.goto("/")
  await page.locator("#search-playground").waitFor()
  for (let theme = 0; theme < 2; theme++) {
    const results = await new AxeBuilder({ page })
      .include("#search-playground")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze()
    expect(results.violations).toEqual([])
    await page.locator("#bar .theme-toggle").click()
  }
})

test("invalid edits keep the last valid results and mark the incorrect span", async ({ page }) => {
  await page.goto("/")
  const input = page.locator(".sp-input")
  await input.fill("has:file")
  await expect(page.locator(".sp-hit")).toHaveCount(5)
  await input.fill("has:file AND chat:")
  await expect(page.locator(".sp-hit")).toHaveCount(5)
  await expect(input).toHaveAttribute("aria-invalid", "true")
  await expect(page.locator(".sp-query-error")).toBeVisible()
  await input.press("Escape")
  await expect(page.locator(".sp-popup")).toHaveCount(0)
  await expect(page.locator(".sp-hint")).toContainText("previous")
  await page.getByRole("button", { name: "Clear query", exact: true }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(36)
  await expect(input).toHaveValue("")
  await expect(page.locator(".sp-results")).toHaveCSS("overflow-y", "auto")
  await expect(page.locator(".sp-results")).toHaveCSS("padding-top", "0px")
})
test("date presets and active filters are editable and clearable", async ({ page }) => {
  await page.goto("/")
  const input = page.locator(".sp-input")
  await input.fill("")
  await page.getByRole("button", { name: "Files +", exact: true }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(5)
  await expect(page.getByRole("button", { name: "Files ×", exact: true })).toHaveAttribute("aria-pressed", "true")
  await page.getByRole("button", { name: "Files ×", exact: true }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(36)
  await page.getByRole("button", { name: "Date", exact: true }).click()
  await expect(page.locator(".sp-suggestion")).toHaveCount(5)
  await page.locator(".sp-suggestion").filter({ hasText: "Whole month" }).click()
  await expect(input).toHaveValue("date:[2026-10-01 TO 2026-10-31]")
  await page.locator("input[type=date]").fill("2026-10-03")
  await expect(input).toHaveValue("date:2026-10-03")
  await page.getByRole("button", { name: "Clear date filter", exact: true }).click()
  await expect(input).toHaveValue("")
})
test("long queries wrap; syntax help is near the input and the demo follows the closing section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto("/")
  const input = page.locator(".sp-input")
  await input.fill("Atlas AND (invoice OR budget) AND (has:file OR has:link) AND date:[2026-10-01 TO 2026-10-31]")
  expect((await input.boundingBox())?.height).toBeGreaterThan(80)
  await page.getByRole("button", { name: "Syntax & fields", exact: true }).click()
  await expect(page.locator(".sp-help-content")).toBeVisible()
  expect(
    await page.evaluate(() => {
      const closing = document.querySelector("#closing")
      const demo = document.querySelector("#search-playground")
      return !!closing && !!demo && Boolean(closing.compareDocumentPosition(demo) & Node.DOCUMENT_POSITION_FOLLOWING)
    }),
  ).toBe(true)
  await expect(page.locator(".sp-examples")).toHaveCount(0)
})
test("the same query playground works in the shared documentation", async ({ page }) => {
  await page.goto("/en/docs/search-playground")
  await expect(page.locator(".sp-hit")).toHaveCount(18)
  await page.locator(".sp-input").fill("")
  await expect(page.locator(".sp-hit")).toHaveCount(36)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const results = await new AxeBuilder({ page }).include("#search-playground").withTags(["wcag2a", "wcag2aa"]).analyze()
  expect(results.violations).toEqual([])
})

test("All browses the sample archive; edits and submit return to Matches", async ({ page }) => {
  await page.goto("/")
  const tabs = page.locator(".sp-views button")
  await expect(tabs).toHaveCount(2)
  await tabs.nth(1).click()
  await expect(page.locator(".sp-hit")).toHaveCount(36)
  await expect(tabs.nth(1)).toHaveAttribute("aria-pressed", "true")
  await page.locator(".sp-input").fill("text:coffee")
  await expect(page.locator(".sp-hit")).toHaveCount(4)
  await expect(tabs.first()).toHaveAttribute("aria-pressed", "true")
  await tabs.nth(1).click()
  await page.locator(".sp-input").press("Escape")
  await page.locator(".sp-trigger").click()
  await page.locator(".sp-input").press("Enter")
  await expect(page.locator(".sp-hit")).toHaveCount(4)
  await tabs.nth(1).click()
  await page.getByRole("button", { name: "Files +", exact: true }).click()
  await expect(tabs.first()).toHaveAttribute("aria-pressed", "true")
  await expect(page.locator(".sp-empty")).toBeVisible()
  await tabs.nth(1).click()
  await expect(page.locator(".sp-hit")).toHaveCount(36)
  await page.locator(".sp-hit").first().click()
  await expect(page.locator(".sp-context-title")).toContainText("Weekend plans")
  await page.getByRole("button", { name: "Back to messages", exact: true }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(36)
})
test("general completion suggests fields; named fields offer useful sample values", async ({ page }) => {
  await page.goto("/")
  const input = page.locator(".sp-input")
  await input.fill("")
  await input.press("Escape")
  await page.locator(".sp-trigger").click()
  await expect(page.locator(".sp-suggestion").filter({ hasText: "text:" })).toHaveCount(1)
  await expect(page.locator(".sp-suggestion").filter({ hasText: "Alice" })).toHaveCount(0)
  await expect(page.locator(".sp-suggestion").filter({ hasText: "invoice" })).toHaveCount(0)
  await input.fill("from:")
  await expect(page.locator(".sp-suggestion").filter({ hasText: "Alice" })).toHaveCount(1)
  await page.locator(".sp-suggestion").filter({ hasText: "Alice" }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(9)
  await input.fill("text:")
  await expect(page.locator(".sp-suggestion").filter({ hasText: "coffee" })).toHaveCount(1)
  await page.locator(".sp-suggestion").filter({ hasText: "coffee" }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(4)
  await input.fill("date:")
  await page.locator(".sp-suggestion").filter({ hasText: "Sample day" }).click()
  await expect(page.locator(".sp-hit")).toHaveCount(8)
})

test("simplified fields and attachment examples work in landing and docs", async ({ page }) => {
  for (const route of ["/", "/ru/docs/search-playground", "/es/docs/search-playground"]) {
    await page.goto(route)
    const input = page.locator(".sp-input:not([readonly])")
    await input.waitFor()
    await input.fill("")
    await input.press("Escape")
    await page.locator(".sp-trigger").click()
    await expect(page.locator(".sp-suggestion").filter({ hasText: "kind:" })).toHaveCount(0)
    await expect(page.locator(".sp-suggestion").filter({ hasText: "body:" })).toHaveCount(0)
    await expect(page.locator(".sp-filters")).not.toContainText(/Chat type|Тип чата|Tipo de chat/u)
    for (const kind of [
      "attachment",
      "link",
      "file",
      "photo",
      "image",
      "video",
      "audio",
      "voice",
      "sticker",
      "contact",
      "location",
      "poll",
    ]) {
      await input.fill(`Atlas has:${kind}`)
      await expect(input).toHaveAttribute("aria-invalid", "false")
      await expect(page.locator(".sp-hit").first()).toBeVisible()
    }
  }
})
