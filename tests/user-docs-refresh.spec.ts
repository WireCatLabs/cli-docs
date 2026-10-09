import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: demo works without installation and references expose contents on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`/${lang}/docs/meeting-brief`)
    const demo = page.locator("[data-meeting-scenario]")
    const send = { en: "Send", ru: "Отправить", es: "Enviar" }[lang]
    await demo.getByRole("button", { name: send, exact: true }).click()
    await expect(demo.locator(".say")).toHaveCount(1)
    await expect(demo.locator(".tool code").first()).toContainText("tg chats list")
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
    await expect(page.locator(".about-project-card")).toContainText("Viacheslav Ptsarev")
    await page.screenshot({ path: `/tmp/wirecat-about-${lang}-mobile.png`, fullPage: true })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.screenshot({ path: `/tmp/wirecat-about-${lang}-desktop.png`, fullPage: true })
  })
}
