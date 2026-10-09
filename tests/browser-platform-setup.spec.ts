import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: remote setup tabs work on mobile, by keyboard and in Markdown`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`/${lang}/docs/browser-apps`)
    const windows = page.getByRole("tab", { name: "Windows", exact: true })
    const mac = page.getByRole("tab", { name: "macOS", exact: true })
    const linux = page.getByRole("tab", { name: "Linux", exact: true })
    await windows.click()
    await expect(page.locator("main pre").filter({ hasText: "tg.cmd mcp --http" })).toBeVisible()
    await expect(page.locator("main pre").filter({ hasText: "sudo tailscale funnel" })).not.toBeVisible()
    await windows.focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("Enter")
    await expect(mac).toHaveAttribute("aria-selected", "true")
    await expect(page.locator("main pre").filter({ hasText: "TAILSCALE_BE_CLI=1" })).toBeVisible()
    await linux.click()
    await expect(page.locator("main pre").filter({ hasText: "sudo tailscale funnel" })).toBeVisible()
    await page.reload()
    await expect(linux).toHaveAttribute("aria-selected", "true")
    for (const app of ["ChatGPT", "Claude", "Gemini", "DeepSeek"]) {
      await page.getByRole("tab", { name: app, exact: true }).click()
      await expect(page.getByRole("heading", { name: new RegExp(`^${app}`) })).toBeVisible()
    }
    await page.getByRole("tab", { name: "Gemini", exact: true }).click()
    await expect(page.getByRole("tabpanel").filter({ hasText: "Custom apps" })).toContainText("Keep Activity")
    await page.goto(`/${lang}/docs/browser-apps#claude`)
    await expect(page.getByRole("heading", { name: /^Claude/ })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(scan.violations).toEqual([])
    const md = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}browser-apps/content.md`)
    expect(md.status()).toBe(200)
    const text = await md.text()
    expect(text).not.toMatch(/<(?:PlatformSetupTabs|Tab)\b/)
    expect(text).toContain("tg.cmd mcp --http")
    expect(text).toContain("TAILSCALE_BE_CLI=1")
    expect(text).toContain("sudo tailscale funnel 8765")
    expect(text).toContain("Custom apps")
    expect(text).toContain("Harness")
  })
}

test("Windows visitors start with PowerShell commands", async ({ browser }) => {
  const context = await browser.newContext({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" })
  const page = await context.newPage()
  await page.goto("/en/docs/browser-apps")
  await expect(page.getByRole("tab", { name: "Windows", exact: true })).toHaveAttribute("aria-selected", "true")
  await expect(page.locator("main pre").filter({ hasText: "tg.cmd mcp --http" })).toBeVisible()
  await context.close()
})
