import { readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { expect, type Page, test } from "@playwright/test"

// Discover every public page so adding a route cannot silently bypass the shell contract.
const directory = fileURLToPath(new URL("../app/", import.meta.url))
const routes = new Set<string>()
for (const file of readdirSync(directory, { recursive: true }).map(String)) {
  const path = file.replaceAll("\\", "/")
  if (!/(?:^|\/)page\.(?:[jt]sx?|mdx)$/.test(path)) continue
  let parts = path.split("/").slice(0, -1)
  if (parts.some((part) => part.startsWith("_"))) continue
  parts = parts.filter((part) => !/^\([^)]*\)$/.test(part))
  if (parts[0] === "[lang]") {
    if (parts[1] === "docs") continue
    parts = parts.slice(1)
  } else if (parts.length) throw new Error(`Public page ${path} needs an explicit locale fixture`)
  if (parts.some((part) => /[[(@]/.test(part)))
    throw new Error(`Public page ${path} needs an explicit parameter fixture`)
  routes.add(parts.length ? `/${parts.join("/")}` : "")
}

/** Compare stable navigation, not the language menu whose destinations follow the current page. */
const shellLinks = (page: Page, html?: string) =>
  page.evaluate((source) => {
    const root = source === undefined ? document : new DOMParser().parseFromString(source, "text/html")
    const links = (selector: string) =>
      [...root.querySelectorAll(selector)].map((node) => ({
        href: node.getAttribute("href"),
        label: node.textContent?.replace(/\s+/g, " ").trim(),
      }))
    return {
      header: links(".public-site-menu > a"),
      footer: links("footer.site a:not([data-language-switcher] a)"),
    }
  }, html)

for (const lang of ["en", "ru", "es"]) {
  const home = lang === "en" ? "/" : `/${lang}`
  for (const route of [...routes].sort()) {
    for (const width of [1440, 390]) {
      test(`${lang}${route || "/"}: public shell matches the homepage at ${width}px`, async ({ page, request }) => {
        const errors: string[] = []
        page.on("pageerror", (error) => errors.push(error.message))
        await page.setViewportSize({ width, height: 900 })
        const response = await page.goto(route ? `/${lang}${route}` : home)
        expect(response?.status()).toBe(200)
        await page.evaluate(() => document.fonts.ready)
        await expect(page.locator("header.site-header")).toHaveCount(1)
        await expect(page.locator("footer.site")).toHaveCount(1)
        await expect(page.locator("main#main")).toHaveCount(1)
        await expect(page.locator("main h1")).toHaveCount(1)
        await expect(page.locator("main h1")).not.toBeEmpty()
        await expect(page.locator("[data-copy-feedback]")).toHaveCount(1)
        await expect(page.locator('.toast[role="status"]')).toHaveCount(0)
        await expect(page.locator("header.site-header a").first()).toHaveAttribute("href", home)
        await expect(page.locator("footer.site .foot-brand > a")).toHaveAttribute("href", home)

        const reference = await request.get(home)
        expect(reference.ok()).toBe(true)
        const expected = await shellLinks(page, await reference.text())
        expect(expected.header.length).toBeGreaterThan(0)
        expect(expected.footer.length).toBeGreaterThan(0)
        expect(await shellLinks(page)).toEqual(expected)
        for (const legal of ["privacy", "terms"]) {
          const link = page.locator(`footer.site .foot-legal a[href="/${lang}/${legal}"]`)
          await expect(link).toHaveCount(1)
          await expect(link).toBeVisible()
        }
        const installation = page.locator("footer.site .footer-install")
        await expect(installation).toBeVisible()
        const command = installation.locator(".cmd code")
        await expect(command).not.toBeEmpty()
        await expect(installation.locator("button[data-copy]")).toHaveAttribute("data-copy", await command.innerText())

        await expect(page.locator(".site-header .editorial-language summary")).toBeVisible()
        const connect = page.locator(".site-header [data-connect]")
        await expect(connect).toHaveCount(1)
        const theme = page.locator(".site-header .theme-switch")
        await expect(theme).toBeVisible()
        const before = await page.locator("html").getAttribute("class")
        await theme.click()
        await expect(page.locator("html")).not.toHaveAttribute("class", before ?? "")

        const menu = page.locator(".site-menu-toggle")
        if (width === 390) {
          await expect(menu).toBeVisible()
          await menu.click()
          await expect(menu).toHaveAttribute("aria-expanded", "true")
          await expect(page.locator(".public-site-menu > a").first()).toBeVisible()
          await expect(connect.locator(":scope > summary")).toBeVisible()
          await page.keyboard.press("Escape")
          await expect(menu).toHaveAttribute("aria-expanded", "false")
          await expect(menu).toBeFocused()
        } else {
          await expect(menu).toBeHidden()
          await expect(connect.locator(":scope > summary")).toBeVisible()
          await expect(page.locator(".public-site-menu > a").first()).toBeVisible()
          await expect(page.locator(".public-site-menu > a").first()).toHaveCSS("font-size", "18px")
          if (route) {
            // Keep route-specific CSS overrides covered once per shared link component.
            // Homepage cases already exercise every matching link exhaustively.
            for (const selector of [
              ".public-site-menu > a",
              "main a.animated-text-link",
              "footer.site .foot-legal > a",
            ]) {
              const link = page.locator(`${selector}:visible`).first()
              if (!(await link.count())) continue
              await link.hover()
              await expect(link).toHaveCSS("text-decoration-line", "none")
              await expect(link.locator(".link-label")).toHaveCSS("background-size", "100% 2px")
              await page.mouse.move(0, 0)
              await page.keyboard.press("Tab")
              await link.focus()
              await expect(link).toHaveCSS("text-decoration-line", "none")
              await expect(link.locator(".link-label")).toHaveCSS("background-size", "100% 2px")
            }
          }
        }

        const aligned =
          width === 390
            ? ".brand, .public-site-controls, .site-menu-toggle"
            : ".brand, .public-site-menu, .public-site-controls"
        const positions = await page
          .locator("header.site-header")
          .locator(aligned)
          .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top))
        expect(positions).toHaveLength(3)
        expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(12)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        expect(errors).toEqual([])
      })
    }
  }
}
