import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: About reads as a project article in both themes and keeps its sections reachable`, async ({
    page,
  }) => {
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" })
      for (const width of [1440, 960, 390]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto(`/${lang}/about`)
        await expect(page.locator("html")).toHaveClass(colorScheme === "dark" ? /dark/ : /light/)
        await expect(page.locator(".about-project-card")).toContainText("MIT")
        await expect(page.locator(".about-project-card")).toContainText("Viacheslav Ptsarev")
        expect((await page.locator(".about-intro").boundingBox())?.height).toBeLessThan(300)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        if (width < 960) {
          const contents = page.locator(".about-mobile-contents")
          await contents.locator("summary").focus()
          await page.keyboard.press("Enter")
          await expect(contents).toHaveAttribute("open", "")
          await contents.locator('a[href="#purpose"]').click()
        } else {
          await page.locator('.about-contents a[href="#purpose"]').click()
        }
        await expect(page.locator("#purpose h2")).toBeInViewport()
        const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
        expect(scan.violations).toEqual([])
        await page.goto(`/${lang}/about`)
        await page.screenshot({
          path: `/tmp/wirecat-project-about-${lang}-${colorScheme}-${width}.png`,
          fullPage: true,
        })
      }
    }
  })
}
