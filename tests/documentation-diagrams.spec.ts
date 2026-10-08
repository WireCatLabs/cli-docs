import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: task onboarding, Markdown equivalents and sidebar icons`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/first-tasks`)
    await expect(page.locator('main figure [role="img"]')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    const violations = await new AxeBuilder({ page }).include("main").analyze()
    expect(violations.violations).toEqual([])
    const locale = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${locale}first-tasks/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).not.toContain("```mermaid")
    expect(markdown).toContain("installation")
    expect(markdown).not.toContain("<Mermaid")
    await page.goto(`/${lang}/docs/agents`)
    await expect(page.locator("main table")).toHaveCount(0)
    await expect(page.locator("main h3 > a[data-card]").filter({ hasText: /^OpenClaw$/ })).toBeVisible()
    const headings = await page.locator("main h3 > a[data-card]").allTextContents()
    expect(headings).toContain("Hermes")
    expect(headings.indexOf("OpenClaw")).toBe(headings.indexOf("Hermes") + 1)
    await expect(page.locator("main pre").first()).toContainText("skill show")
    const agentResponse = await request.get(`/llms.mdx/docs/${locale}agents/content.md`)
    expect(agentResponse.ok()).toBe(true)
    const agentMarkdown = await agentResponse.text()
    expect(agentMarkdown).toContain("OpenClaw")
    expect(agentMarkdown).toContain("setup --agent codex")
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`/${lang}/docs/architecture`)
    const packages = page.locator("main figure").filter({ hasText: "@leemour/tg-cli" })
    await expect(packages).toHaveCount(1)
    await expect(packages).toContainText("@leemour/cli-messaging")
    for (const slug of ["architecture", "search-architecture", "people", "meeting-brief"]) {
      const link = page.locator(`#nd-sidebar a[href="/${lang}/docs/${slug}"]`)
      await expect(link).toHaveCount(1)
      await expect(link.locator("svg")).toHaveCount(1)
    }
    await expect(page.locator(`#nd-sidebar a[href="/${lang}/docs/meeting-brief"] .lucide-video`)).toHaveCount(1)
  })
}
