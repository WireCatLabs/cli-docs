import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: Memo section replaces the notes page at the same address`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/memo`)
    await expect(page.locator(`main a[href="/${lang}/docs/memo/installation"]`).first()).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/memo/recipes"]`).first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: Memo installation has no messenger login guide`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/memo/installation`)
    await expect(page.locator("main")).toContainText("npm install -g @wirecat/cli-memo")
    await expect(page.locator("#agent-installation")).toHaveCount(0)
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}memo/installation/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("npm install -g @wirecat/cli-memo")
  })

  test(`${lang}: shared installation page links to Memo installation`, async ({ page }) => {
    await page.goto(`/${lang}/docs/installation`)
    await expect(page.locator(`main a[href="/${lang}/docs/memo/installation"]`).first()).toBeVisible()
  })

  test(`${lang}: remote Memo guide connects from MCP navigation and retains its Markdown instructions`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/memo/mcp`)
    const remote = page.locator(`main a[href="/${lang}/docs/memo/remote"]`).first()
    await remote.focus()
    await remote.press("Enter")
    await expect(page).toHaveURL(`/${lang}/docs/memo/remote`)
    await expect(page.locator("main h1")).toBeVisible()
    await expect(page.locator("main")).toContainText("memo mcp --revoke --json")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const scan = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze()
    expect(scan.violations).toEqual([])
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}memo/remote/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("memo mcp --http --public-url https://device.example")
  })
}
