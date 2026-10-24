import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  for (const width of [1440, 390]) {
    test(`${lang}: WhatsApp setup and guides at ${width}px`, async ({ page, request }, testInfo) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(lang === "en" ? "/" : `/${lang}`)
      const menu = page.locator(width === 390 ? ".hero [data-connect]" : ".site-header [data-connect]").first()
      await menu.locator(":scope > summary").click()
      await menu.locator('[data-connect-provider="wa"]').click()
      await expect(menu.locator(".agent-prompt")).toContainText("@wirecat/whatsapp-cli")
      await expect(menu.locator(".agent-prompt")).not.toContainText("@wirecat/wa-cli")
      await expect(menu.locator(".command [data-copy]")).toHaveAttribute(
        "data-copy",
        "npm install -g @wirecat/whatsapp-cli && wa skill install --for all",
      )
      await menu.locator(".connect-guide").click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/docs/installation#wa$`))
      await page.locator(`main a[href="/${lang}/docs/wa/installation"]`).first().click()
      const header = page.locator("#nd-subnav")
      if (width === 390) {
        const messenger = header.getByRole("combobox")
        await expect(messenger).toHaveValue("wa")
        await messenger.selectOption("tg")
        await expect(page).toHaveURL(new RegExp(`/${lang}/docs/tg/installation$`))
        await messenger.selectOption("wa")
        await expect(page).toHaveURL(new RegExp(`/${lang}/docs/wa/installation$`))
      } else
        await expect(header.getByRole("link", { name: "WhatsApp", exact: true })).toHaveAttribute(
          "aria-current",
          "page",
        )
      await expect(page.locator(".site-footer-docs [data-copy]")).toHaveAttribute(
        "data-copy",
        "npm install -g @wirecat/whatsapp-cli && wa skill install --for all",
      )
      await expect(page.locator("main #log-in")).toHaveCount(1)
      await expect(page.locator("main #connect-agent")).toHaveCount(1)
      await expect(page.locator("main #check")).toHaveCount(1)
      await expect(page.locator("main code", { hasText: /^wa personal setup$/ }).first()).toBeVisible()
      await expect(page.locator("main .docs-prompt")).toContainText("wa CLI")
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
      expect(scan.violations).toEqual([])
      if (lang === "en") await page.screenshot({ path: testInfo.outputPath("whatsapp-install.png"), fullPage: true })
      const md = await request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}wa/installation/content.md`)
      expect(md.ok()).toBe(true)
      const text = await md.text()
      expect(text).toContain("@wirecat/whatsapp-cli")
      expect(text).toContain("wa personal setup")
      expect(text).toContain("wa skill install --for all")
      await page.goto(`/${lang}/docs/wa`)
      await expect(page.locator(`main a[href="/${lang}/docs/wa/bot"]`).first()).toBeVisible()
      await expect(page.locator(`main a[href="/${lang}/docs/wa/permissions"]`).first()).toBeVisible()
    })
  }
}
