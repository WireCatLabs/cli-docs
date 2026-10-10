import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  for (const surface of ["home", "about", "docs"]) {
    test(`${lang}/${surface}: rounded language controls stay consistent at 320px`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 900 })
      const path =
        surface === "home"
          ? lang === "en"
            ? "/"
            : `/${lang}`
          : `/${lang}/${surface === "docs" ? "docs/bot-api" : "about"}`
      await page.goto(path)
      const header = page.locator(surface === "docs" ? "#nd-subnav" : "header.site-header")
      const footer = page.locator("footer")
      const control = header.locator("[data-language-switcher]")
      await expect(control.locator("summary")).toBeInViewport({ ratio: 1 })
      for (const host of [header, footer]) {
        const switcher = host.locator("[data-language-switcher]")
        await expect(switcher.locator(".language-code")).toHaveText(lang.toUpperCase())
        expect(
          await switcher.locator(".language-code").evaluate((node) => {
            const range = document.createRange()
            range.selectNodeContents(node)
            return range.getClientRects().length
          }),
        ).toBe(1)
        await expect(switcher.locator("summary")).toHaveCSS("border-radius", "999px")
        await expect(switcher.locator("summary")).toHaveCSS("display", "flex")
      }
      const shapes = await page
        .locator(
          `${surface === "docs" ? "#nd-subnav" : "header.site-header"} [data-language-switcher] summary, footer [data-language-switcher] summary`,
        )
        .evaluateAll((nodes) =>
          nodes.map((node) => {
            const css = getComputedStyle(node)
            return [
              css.fontSize,
              css.lineHeight,
              css.borderRadius,
              css.padding,
              css.gap,
              node.getBoundingClientRect().height,
            ]
          }),
        )
      expect(shapes[0]).toEqual(shapes[1])
      await control.locator("summary").focus()
      await page.keyboard.press("Enter")
      await expect(control).toHaveAttribute("open", "")
      const destination = lang === "es" ? "en" : "es"
      const expected =
        surface === "home"
          ? destination === "en"
            ? "/"
            : `/${destination}`
          : `/${destination}/${surface === "docs" ? "docs/bot-api" : "about"}`
      await expect(control.locator(`a[lang="${destination}"]`)).toHaveAttribute("href", expected)
      await page.keyboard.press("Escape")
      await expect(control).not.toHaveAttribute("open", "")
      await expect(control.locator("summary")).toBeFocused()
      const footerControl = footer.locator("[data-language-switcher]")
      await footerControl.locator("summary").click()
      await footerControl.locator(`a[lang="${destination}"]`).click()
      await expect(page).toHaveURL(new RegExp(`${expected.replace(/\//g, "\\/")}/?$`))
      await expect(
        page.locator(surface === "docs" ? "#nd-subnav .language-code" : "header.site-header .language-code"),
      ).toHaveText(destination.toUpperCase())
    })
  }
}

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: Escape closes the sidebar language menu before the sidebar`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 })
    await page.goto(`/${lang}/docs/bot-api`)
    const trigger = page.locator('#nd-subnav button[aria-controls="nd-sidebar-mobile"]')
    await trigger.click()
    const menu = page.locator("#nd-sidebar-mobile [data-language-switcher]")
    await menu.locator("summary").click()
    await page.keyboard.press("Escape")
    await expect(menu).not.toHaveAttribute("open", "")
    await expect(menu.locator("summary")).toBeFocused()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await page.keyboard.press("Escape")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toBeFocused()
  })
}
