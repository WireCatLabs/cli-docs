import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: short prompts copy their request and security guidance survives Markdown export`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`/${lang}/docs`)
    const prompts = page.locator(".docs-snippet-compact")
    await expect(prompts).toHaveCount(5)
    const text = await prompts.first().locator("code").innerText()
    await prompts.first().getByRole("button").click()
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(text)
    await expect(prompts.first().locator(".docs-snippet-label")).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const overview = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}content.md`)
    expect(overview.ok()).toBe(true)
    expect(await overview.text()).toContain(text)
    await page.goto(`/${lang}/docs/security`)
    await expect(page.locator("article")).toContainText("WireCat")
    await expect(page.locator('a[href*="cli-testing"][href$="METHOD.md"]')).toBeVisible()
    const injection = { en: "Prompt injection", ru: "Инъекция инструкций", es: "Inyección de instrucciones" }[lang]
    await expect(page.getByRole("heading", { name: injection })).toBeVisible()
    const markdown = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}security/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain(injection)
    const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(scan.violations).toEqual([])
    await page.goto(`/${lang}/docs/browser-apps`)
    const title = {
      en: "Use from web or mobile",
      ru: "В браузере или на телефоне",
      es: "Usar desde la web o el móvil",
    }[lang]
    await expect(page.getByRole("heading", { name: title, exact: true }).first()).toBeVisible()
  })
}
