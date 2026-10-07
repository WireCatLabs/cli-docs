import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: demo works without installation and references expose contents on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`/${lang}/docs/meeting-brief`)
    const demo = page.locator(".meeting-brief-demo")
    await demo.getByRole("button").click()
    await expect(demo).toContainText("msg:telegram/demo/301/12")
    await expect(demo).toContainText("msg:telegram/demo/301/13")
    const labels = {
      en: "Open contents to find a section",
      ru: "Открыть оглавление и выбрать раздел",
      es: "Abrir el índice para elegir una sección",
    }
    await page.goto(`/${lang}/docs/configuration`)
    await page.getByRole("button", { name: labels[lang as keyof typeof labels] }).click()
    await expect(page.locator("#nd-toc-popover details")).toHaveAttribute("open", "")
    await page.keyboard.press("Escape")
    await expect(page.locator("#nd-toc-popover details")).not.toHaveAttribute("open", "")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(scan.violations).toEqual([])
    await page.goto(`/${lang}/about`)
    await expect(page.locator(".about-entry-links a").first()).toHaveAttribute("href", `/${lang}/docs/meeting-brief`)
    await page.screenshot({ path: `/tmp/wirecat-about-${lang}-mobile.png`, fullPage: true })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.screenshot({ path: `/tmp/wirecat-about-${lang}-desktop.png`, fullPage: true })
  })
}
