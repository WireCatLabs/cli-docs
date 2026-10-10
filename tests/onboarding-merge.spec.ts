import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  for (const width of [1440, 390]) {
    for (const route of ["features", "installation"]) {
      test(`${lang}/${route}: shared sidebar and layout at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${lang}/docs/${route}`)
        await page.evaluate(() => document.fonts.ready)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        const main = page.locator("main")
        if (route === "features") {
          await expect(main.locator("table")).toHaveCount(0)
          for (const target of ["agents", "search", "people", "memo", "bot-api", "group-admins", "permissions"]) {
            await expect(main.locator(`a[href="/${lang}/docs/${target}"]`).first()).toBeVisible()
          }
        } else {
          for (const target of ["tg/installation", "max/installation", "memo#install-memo"]) {
            await expect(main.locator(`a[href="/${lang}/docs/${target}"]`).first()).toBeVisible()
          }
          await expect(main.locator(".docs-term-trigger").first()).toBeEnabled()
          await expect(main.locator("pre").filter({ hasText: "node --version" }).first()).toBeVisible()
        }
        const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
        expect(scan.violations, `${route} ${width}`).toEqual([])
      })
    }
  }

  for (const tool of ["tg", "max"]) {
    test(`${lang}/${tool}: installation deep links lead from landing to tool guides`, async ({ page }) => {
      await page.goto(`/${lang}`)
      const menu = page.locator(".site-header [data-connect]")
      await menu.locator(":scope > summary").click()
      await menu.locator(`[data-connect-provider="${tool}"]`).click()
      await expect(menu.locator(".agent-prompt")).toContainText(`@wirecat/${tool}-cli`)
      await expect(menu.locator(".command [data-copy]")).toHaveAttribute(
        "data-copy",
        `npm install -g @wirecat/${tool}-cli && ${tool} skill install --for all`,
      )
      await menu.locator(".connect-guide").click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/docs/installation#${tool}$`))
      await expect(page.locator(`main a#${tool}`)).toHaveCount(1)
      const guide = page.locator(`main a[href="/${lang}/docs/${tool}/installation"]`).first()
      await guide.click()
      await expect(page).toHaveURL(new RegExp(`/${lang}/docs/${tool}/installation$`))
      await expect(page.locator("main")).toContainText(`@wirecat/${tool}-cli`)
      const login = page.locator("section[aria-labelledby=install-login]")
      await expect(login.locator("ol").first()).toBeVisible()
      await expect(login.locator("code").first()).toHaveText(`${tool} setup`)
    })

    test(`${lang}/${tool}: login instructions and request match the Markdown guide`, async ({ page }) => {
      await page.goto(`/${lang}/docs/${tool}/installation`)
      const login = page.locator("section[aria-labelledby=install-login]")
      await login.locator("[data-installation-login-help] button").first().click()
      await expect(login.locator("img")).toHaveCount(tool === "tg" ? 5 : 0)
      await expect(login.locator("figure:not(:has(img))")).toHaveCount(tool === "tg" ? 1 : 2)
      for (const image of await login.locator("img").all()) {
        await image.scrollIntoViewIfNeeded()
        await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      }

      const md = await page.request.get(
        `/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}${tool}/installation/content.md`,
      )
      expect(md.status()).toBe(200)
      const markdown = await md.text()
      for (const image of await login
        .locator("img")
        .evaluateAll((nodes) =>
          nodes.map((node) => ({ src: node.getAttribute("src"), alt: node.getAttribute("alt") })),
        )) {
        expect(markdown).toContain(`![${image.alt}](${image.src})`)
      }
      for (const slot of await login.locator("figure:not(:has(img))").allTextContents()) {
        expect(markdown).toContain(slot.trim())
      }

      for (const paragraph of await login.locator("p, li").evaluateAll((nodes) =>
        nodes
          .map((node) =>
            [...node.childNodes]
              .filter((child) => child.nodeType === Node.TEXT_NODE)
              .map((child) => child.textContent)
              .join(""),
          )
          .filter((text) => text.trim() !== "" && text.trim() !== "→"),
      )) {
        expect(markdown).toContain(paragraph.replace(/ →$/, ""))
      }
      expect(markdown).toContain(
        await page.locator("section[aria-labelledby=install-request] .docs-prompt code").textContent(),
      )
      expect(markdown.indexOf("[#install-login]")).toBeLessThan(markdown.indexOf("[#installation-reference]"))
    })
  }

  test(`${lang}: installation deep links and common setup are readable in Markdown`, async ({ page }) => {
    const md = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`)
    expect(md.status()).toBe(200)
    const text = await md.text()
    expect(text).not.toMatch(/<(?:DocTerm|NodeSetupPrompt|Tabs|Tab|Steps|Step|Accordion)/)
    expect(text).toContain("node --version")
    expect(text).toContain("npm --version")
    expect(text).toContain("memo")
    expect(text).toContain("tg/installation")
    expect(text).toContain("max/installation")
    expect(text).toContain("MCP")
  })
}
