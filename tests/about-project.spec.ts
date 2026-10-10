import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { observeExternalRequests } from "./site-network"

for (const lang of ["en", "ru", "es"]) {
  for (const colorScheme of ["light", "dark"] as const) {
    for (const width of [1440, 960, 390]) {
      test(`${lang}: About at ${width}px in ${colorScheme} offers contact and separate documentation/source links`, async ({
        page,
      }, testInfo) => {
        const externalRequests = observeExternalRequests(page)
        await page.emulateMedia({ colorScheme, reducedMotion: "reduce" })
        await test.step("Content, layout and keyboard controls", async () => {
          await page.setViewportSize({ width, height: 1000 })
          await page.goto(`/${lang}/about`)
          await expect(page.locator("html")).toHaveClass(colorScheme === "dark" ? /dark/ : /light/)
          await expect(page.locator(".about-project-card")).toContainText("Apache 2.0")
          await expect(page.locator(".about-project-card")).toContainText("Viacheslav Ptsarev")
          expect((await page.locator(".about-intro").boundingBox())?.height).toBeLessThan(300)
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
          const contacts = page.locator(".about-contact-actions:visible")
          await expect(contacts).toHaveCount(1)
          await expect(contacts.locator("a").first()).toHaveAttribute("href", "mailto:hello@wirecat.dev")
          await expect(contacts.locator("a").last()).toHaveAttribute("href", "https://t.me/hurrykan")
          await contacts.locator("a").first().focus()
          await page.keyboard.press("Tab")
          await expect(contacts.locator("a").last()).toBeFocused()
          await expect(page.locator("#open-source strong")).toBeVisible()
          await expect(page.locator(".about-contents, .about-mobile-contents, .about-open")).toHaveCount(0)
          const telegram = page
            .locator(".about-tool-row")
            .filter({ has: page.locator('a[href="https://github.com/WireCatLabs/tg-cli"]') })
          await expect(telegram.locator(".about-tool-docs")).toHaveAttribute("href", `/${lang}/docs/tg`)
          await expect(telegram.locator(".about-tool-source")).toHaveAttribute(
            "href",
            "https://github.com/WireCatLabs/tg-cli",
          )
          const max = page
            .locator(".about-tool-row")
            .filter({ has: page.locator('a[href="https://github.com/WireCatLabs/max-cli"]') })
          await expect(max.locator(".about-tool-docs")).toHaveAttribute("href", `/${lang}/docs/max`)
          await expect(max.locator(".about-tool-source")).toHaveAttribute(
            "href",
            "https://github.com/WireCatLabs/max-cli",
          )
          await expect(page.locator('.about-tool-source[href="https://github.com/WireCatLabs/cli-memo"]')).toBeVisible()
        })
        await test.step("Accessibility", async () => {
          const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
          expect(scan.violations).toEqual([])
        })
        await test.step("Screenshot", async () => {
          await page.screenshot({
            path: testInfo.outputPath("about.png"),
            fullPage: true,
          })
        })
        expect(externalRequests, "Static About page must not request external services").toEqual([])
      })
    }
  }
}
