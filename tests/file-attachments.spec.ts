import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const titles = { en: "File attachments", ru: "Файловые вложения", es: "Archivos adjuntos" }
for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: attachment guides explain the result and retain icons on desktop and mobile`, async ({ page }) => {
    test.setTimeout(120000)
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const tool of ["tg", "max"]) {
        await page.goto(`/${lang}/docs/${tool}/attachments`)
        await expect(page.locator("main h1")).toHaveText(titles[lang])
        await expect(page.locator("main")).toContainText("content:")
        await expect(page.locator("main table")).not.toHaveCount(0)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        if (width === 390) await page.locator('#nd-subnav button[aria-controls="nd-sidebar-mobile"]').click()
        const sidebar = page.locator(width === 390 ? "#nd-sidebar-mobile" : "#nd-sidebar")
        await expect(sidebar).toBeVisible()
        const missing = await sidebar
          .locator('a[href*="/docs/"]')
          .evaluateAll((links) =>
            links
              .filter((link) => !(link.closest("summary") ?? link).querySelector('svg[aria-hidden="true"]'))
              .map((link) => link.getAttribute("href")),
          )
        expect(missing, "every navigation link has a decorative subject icon").toEqual([])
        const attachment = sidebar.locator(`a[href="/${lang}/docs/${tool}/attachments"]`)
        await expect(attachment.locator("svg.lucide-paperclip")).toHaveCount(1)
        if (width === 390) await page.keyboard.press("Escape")
        const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
        expect(result.violations).toEqual([])
      }
    }
    const markdown = await page.request.get(
      `/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}tg/attachments/content.md`,
    )
    expect(markdown.status()).toBe(200)
    expect(await markdown.text()).toContain("models.ocr")
  })
}
