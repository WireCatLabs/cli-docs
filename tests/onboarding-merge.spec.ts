import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: improved features and installation retain the shared sidebar and mobile layout`, async ({ page }) => {
    test.setTimeout(120000)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const route of ["features", "installation"]) {
        await page.goto(`/${lang}/docs/${route}`)
        await page.evaluate(() => document.fonts.ready)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        if (route === "features") {
          await expect(page.locator("main table")).toHaveCount(5)
          for (const summary of await page.locator("main details > summary").all()) await summary.click()
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
          await expect(page.locator("main")).toContainText("185")
          await expect(page.locator("main")).toContainText("33")
        } else {
          await expect(page.getByRole("tab", { name: "Telegram", exact: true }).first()).toBeEnabled()
          await expect(page.locator(".docs-term-trigger").first()).toBeEnabled()
        }
        const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
        expect(scan.violations, `${route} ${width}`).toEqual([])
      }
    }
  })

  test(`${lang}: messenger deep links select all tabs; Windows choice survives reload and uses npm`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/docs/installation#max`)
    const messenger = page.getByRole("tab", { name: "MAX", exact: true }).first()
    await expect(messenger).toHaveAttribute("aria-selected", "true")
    await expect(page.locator(".docs-prompt").filter({ hasText: "npm install -g @leemour/max-cli" })).toBeVisible()
    await page.getByRole("tab", { name: "Windows", exact: true }).click()
    await expect(
      page.locator("main pre").filter({ hasText: "npm.cmd install -g --allow-scripts=@leemour/max-cli" }),
    ).toBeVisible()
    await page.reload()
    await expect(page.getByRole("tab", { name: "Windows", exact: true })).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tab", { name: "MAX", exact: true }).first()).toHaveAttribute("aria-selected", "true")
    await page.evaluate(() => {
      window.location.hash = "tg"
    })
    await expect(page.getByRole("tab", { name: "Telegram", exact: true }).first()).toHaveAttribute(
      "aria-selected",
      "true",
    )
    await expect(
      page.locator("main pre").filter({ hasText: "npm.cmd install -g --allow-scripts=@leemour/tg-cli" }),
    ).toBeVisible()
    const md = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`)
    expect(md.status()).toBe(200)
    const text = await md.text()
    expect(text).not.toMatch(/<(?:AgentInstallPrompt|Screenshot|Tabs|Tab|Steps|Step|Accordion)/)
    expect(text).toContain("npm.cmd install -g --allow-scripts=@leemour/max-cli")
    expect(text).toContain("/screenshots/telegram/my-telegram-credentials.png")
  })
}
