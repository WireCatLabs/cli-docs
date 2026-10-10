import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: sidebar can return to onboarding from the document footer`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`/${lang}/docs/bot-api`)
    const sidebar = page.locator("#nd-sidebar")
    const viewport = sidebar.locator('[data-id$="-viewport"]')
    await expect(viewport).toHaveCount(1)
    for (const slug of ["", "/installation", "/agents", "/first-tasks", "/features", "/prompting", "/mcp"])
      await expect(viewport.locator(`a[href="/${lang}/docs${slug}"]`)).toHaveCount(1)

    // Reproduce the partially clipped sticky sidebar while the footer is on screen.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await expect.poll(() => sidebar.evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(0)
    const pageScroll = await page.evaluate(() => window.scrollY)
    await viewport.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    const box = await viewport.boundingBox()
    if (!box) throw new Error("Sidebar viewport has no bounds")
    await page.mouse.move(box.x + box.width / 2, box.y + box.height - 20)
    await page.mouse.wheel(0, -2000)
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBe(0)
    // A second upward gesture at the sidebar boundary must return to the document.
    await page.mouse.wheel(0, -1200)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(pageScroll)
    const installation = viewport.locator(`a[href="/${lang}/docs/installation"]`)
    await expect(installation).toBeInViewport()
    await installation.focus()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(new RegExp(`/${lang}/docs/installation/?$`))
  })

  test(`${lang}: mobile sidebar scrolls all navigation in one viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/bot-api`)
    const menu = page.locator('#nd-subnav button[aria-controls="nd-sidebar-mobile"]')
    await menu.click()
    const sidebar = page.locator("#nd-sidebar-mobile")
    const viewport = sidebar.locator('[data-id$="-viewport"]')
    await expect(viewport).toHaveCount(1)
    for (const slug of ["", "/installation", "/agents", "/first-tasks", "/features", "/prompting", "/mcp", "/testing"])
      await expect(viewport.locator(`a[href="/${lang}/docs${slug}"]`)).toHaveCount(1)
    await viewport.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    await expect(viewport.locator(`a[href="/${lang}/docs/testing"]`)).toBeInViewport()
    await viewport.evaluate((element) => {
      element.scrollTop = 0
    })
    await expect(viewport.locator(`a[href="/${lang}/docs/installation"]`)).toBeInViewport()
    await page.keyboard.press("Escape")
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await expect(menu).toBeFocused()
  })
}
