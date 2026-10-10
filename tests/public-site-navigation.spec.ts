import { expect, test } from "@playwright/test"

test("public pages share mobile navigation and close it after navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/ru")
  const toggle = page.locator(".site-menu-toggle")
  await expect(toggle).toBeVisible()
  await expect(page.locator("header.site-header")).toHaveCount(1)
  await expect(page.locator("footer")).toHaveCount(1)
  await expect(page.locator('.public-site-menu > a[href="/ru/features"]')).toHaveCount(0)
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-expanded", "true")
  await page.locator('.public-site-menu > a[href="/ru/about"]').click()
  await expect(page).toHaveURL(/\/ru\/about$/)
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  await expect(page.locator("header.site-header")).toHaveCount(1)
  await expect(page.locator("footer")).toHaveCount(1)
  await toggle.click()
  await page.keyboard.press("Escape")
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  await expect(toggle).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test("documentation has a working theme control in the mobile header", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/ru/docs/installation")
  const toggle = page.locator('#nd-subnav button[title*="тем"]')
  await expect(toggle).toBeVisible()
  const before = await page.locator("html").getAttribute("class")
  await toggle.click()
  await expect(page.locator("html")).not.toHaveAttribute("class", before ?? "")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: header keeps language and theme visible and moves only controls that cannot fit`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(lang === "en" ? "/" : `/${lang}`)
    const header = page.locator("header.site-header")
    const menu = header.locator(".site-menu-toggle")
    const connect = header.locator("[data-connect]")
    await expect(menu).toBeHidden()
    const links = header.locator(".public-site-menu")
    await expect(links.locator(":scope > a").first()).toHaveCSS("font-size", "18px")
    const desktopSpacing = await header.evaluate((node) => {
      const brand = node.querySelector(".brand")?.getBoundingClientRect()
      const links = node.querySelector(".public-site-menu")?.getBoundingClientRect()
      const controls = node.querySelector(".public-site-controls")?.getBoundingClientRect()
      if (!brand || !links || !controls) throw new Error("Missing header navigation")
      return { brandGap: links.left - brand.right, controlsGap: controls.left - links.right }
    })
    expect(desktopSpacing.brandGap).toBeGreaterThan(desktopSpacing.controlsGap)
    expect(desktopSpacing.controlsGap).toBeCloseTo(20, 0)
    for (const selector of [".public-site-menu > a", "main a.text-link", "footer a.animated-text-link"]) {
      const link = page.locator(`${selector}:visible`).first()
      await link.hover()
      await expect(link).toHaveCSS("text-decoration-line", "none")
      await expect(link.locator(".link-label")).toHaveCSS("background-size", "100% 2px")
      await link.focus()
      await expect(link).toHaveCSS("text-decoration-line", "none")
    }
    let compactWithConnect = false
    for (const width of [980, 900, 850, 800, 760, 720, 680, 640, 600]) {
      await page.setViewportSize({ width, height: 900 })
      await page.waitForTimeout(100)
      if (
        (await menu.isVisible()) &&
        (await header.locator(".public-site-controls [data-connect] > summary").isVisible())
      ) {
        compactWithConnect = true
        break
      }
    }
    expect(compactWithConnect).toBe(true)
    await expect(header.locator(".editorial-language summary")).toBeVisible()
    await expect(header.locator(".theme-switch")).toBeVisible()
    await expect(header.locator(".public-site-controls [data-connect] > summary")).toBeVisible()
    const positions = await header
      .locator(".brand, .public-site-controls, .site-menu-toggle")
      .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top))
    expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(12)
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(header.locator(".editorial-language summary")).toBeVisible()
      await expect(header.locator(".theme-switch")).toBeVisible()
      await expect(header.locator(".public-site-controls [data-connect]")).toHaveCount(0)
      await menu.click()
      await expect(connect.locator(":scope > summary")).toBeVisible()
      await connect.locator(":scope > summary").click()
      await expect(connect.locator(".connect-panel")).toBeVisible()
      await page.keyboard.press("Escape")
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    }
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(menu).toBeHidden()
    await expect(header.locator(".public-site-controls [data-connect] > summary")).toBeVisible()
  })
}

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: public pages share their shell and single link underline`, async ({ page }) => {
    test.setTimeout(120000)
    let sharedLinks: string[] | undefined
    for (const suffix of ["", "/about", "/features", "/examples"]) {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(lang === "en" && !suffix ? "/" : `/${lang}${suffix}`)
      await expect(page.locator("header.site-header")).toHaveCount(1)
      await expect(page.locator("footer")).toHaveCount(1)
      await expect(page.locator("main#main")).toHaveCount(1)
      await expect(page.locator("[data-copy-feedback]")).toHaveCount(1)
      await expect(page.locator('.toast[role="status"]')).toHaveCount(0)
      const links = await page
        .locator(".public-site-menu > a, footer a:not([data-language-switcher] a)")
        .evaluateAll((nodes) => nodes.map((node) => `${node.textContent?.trim()}:${node.getAttribute("href")}`))
      if (sharedLinks) expect(links).toEqual(sharedLinks)
      else sharedLinks = links
      for (const selector of [".public-site-menu > a", "main a.animated-text-link", "footer a.animated-text-link"]) {
        for (const link of await page.locator(`${selector}:visible`).all()) {
          await link.hover()
          await expect(link).toHaveCSS("text-decoration-line", "none")
          await expect(link.locator(".link-label")).toHaveCSS("background-size", "100% 2px")
          await link.focus()
          await expect(link).toHaveCSS("text-decoration-line", "none")
          await expect(link.locator(".link-label")).toHaveCSS("background-size", "100% 2px")
        }
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await expect(page.locator(".site-menu-toggle")).toBeVisible()
      await expect(page.locator(".site-header .editorial-language summary")).toBeVisible()
      await expect(page.locator(".site-header .theme-switch")).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    }
  })
}
