import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  for (const width of [1440, 390]) {
    for (const route of ["features", "installation"]) {
      test(`${lang}/${route}: shared sidebar and layout at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${lang}/docs/${route}`)
        await page.evaluate(() => document.fonts.ready)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        const main = page.locator("main")
        if (route === "features") {
          await expect(main.locator("table")).toHaveCount(0)
          for (const target of ["agents", "search", "people", "memo", "bot-api", "group-admins", "permissions"]) {
            await expect(main.locator(`a[href="/${lang}/docs/${target}"]`).first()).toBeVisible()
          }
        } else {
          for (const target of ["tg/installation", "max/installation", "memo#install-memo"]) {
            await expect(main.locator(`a[href="/${lang}/docs/${target}"]`).first()).toBeVisible()
          }
          await expect(main.locator(".docs-term-trigger").first()).toBeEnabled()
          await expect(main.locator("pre").filter({ hasText: "node --version" }).first()).toBeVisible()
        }
        const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
        expect(scan.violations, `${route} ${width}`).toEqual([])
      })
    }
  }

  for (const tool of ["tg", "max"]) {
    test(`${lang}/${tool}: installation deep links lead from landing to tool guides`, async ({ page }) => {
      await page.goto(`/${lang}`)
      const menu = page.locator(".site-header [data-connect]")
      await menu.locator(":scope > summary").click()
      await menu.locator(`[data-connect-provider="${tool}"]`).click()
      await expect(menu.locator(".agent-prompt")).toContainText(`@wirecat/${tool}-cli`)
      await expect(menu.locator(".command [data-copy]")).toHaveAttribute(
        "data-copy",
        `npm install -g @wirecat/${tool}-cli && ${tool} skill install --for all`,
      )
      await menu.locator(".connect-guide").click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/docs/installation#${tool}$`))
      await expect(page.locator(`main a#${tool}`)).toHaveCount(1)
      const guide = page.locator(`main a[href="/${lang}/docs/${tool}/installation"]`).first()
      await guide.click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/docs/${tool}/installation$`))
      await expect(page.locator("main")).toContainText(`@wirecat/${tool}-cli`)
    })
  }

  test(`${lang}: installation deep links and common setup are readable in Markdown`, async ({ page }) => {
    const md = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`)
    expect(md.status()).toBe(200)
    const text = await md.text()
    expect(text).not.toMatch(/<(?:DocTerm|NodeSetupPrompt|Tabs|Tab|Steps|Step|Accordion)/)
    expect(text).toContain("node --version")
    expect(text).toContain("npm --version")
    expect(text).toContain("memo")
    expect(text).toContain("tg/installation")
    expect(text).toContain("max/installation")
    expect(text).toContain("MCP")
  })
}
