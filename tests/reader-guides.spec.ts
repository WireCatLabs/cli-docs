import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  for (const tool of ["tg", "max"]) {
    test(`${lang}/${tool}: tasks precede syntax, old links reveal it and Markdown retains both`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 })
      for (const route of ["usage", "rankings"]) {
        await page.goto(`/${lang}/docs/${tool}/${route}`)
        const guide = page.locator("[data-reader-guide]")
        await expect(guide).toBeVisible()
        await expect(guide.locator(".docs-copy").first()).toBeEnabled()
        const reference = page.locator("[data-technical-reference]")
        await expect(reference).not.toHaveAttribute("open", "")
        if (route === "rankings") await expect(page.locator("[data-report-fixture] tbody tr")).toHaveCount(3)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
        expect(scan.violations).toEqual([])
        const id = await reference.locator("h2").first().getAttribute("id")
        expect(id).toBeTruthy()
        await page.goto(`/${lang}/docs/${tool}/${route}#${encodeURIComponent(id ?? "")}`)
        await expect(reference).toHaveAttribute("open", "")
        const md = await page.request.get(
          `/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}${tool}/${route}/content.md`,
        )
        expect(md.status()).toBe(200)
        const text = await md.text()
        expect(text).toContain(tool === "tg" ? "Telegram" : "MAX")
        expect(text).toContain(route === "usage" ? `${tool} messages send` : `${tool} stats`)
        expect(text).not.toContain("<ReaderGuide")
        if (route === "rankings") expect(text).toContain("103")
      }
    })
  }
}
