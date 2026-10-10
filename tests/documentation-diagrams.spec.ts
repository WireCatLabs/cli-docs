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
    await expect(page.locator("main pre").first()).toContainText("tg setup --agent codex")
    await expect(page.locator("main pre").filter({ hasText: "tg skill show" }).first()).toBeVisible()
    const agentResponse = await request.get(`/llms.mdx/docs/${locale}agents/content.md`)
    expect(agentResponse.ok()).toBe(true)
    const agentMarkdown = await agentResponse.text()
    expect(agentMarkdown).toContain("OpenClaw")
    expect(agentMarkdown).toContain("setup --agent codex")
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`/${lang}/docs/architecture`)
    const packages = page.locator("main figure").filter({ hasText: "@wirecat/tg-cli" })
    await expect(packages).toHaveCount(1)
    await expect(packages).toContainText("@wirecat/cli-messaging")
    for (const slug of ["architecture", "search-architecture", "data-model", "people", "meeting-brief"]) {
      const link = page.locator(`#nd-sidebar a[href="/${lang}/docs/${slug}"]`)
      await expect(link).toHaveCount(1)
      await expect(link.locator("svg")).toHaveCount(1)
    }
    await expect(page.locator(`#nd-sidebar a[href="/${lang}/docs/meeting-brief"] .lucide-video`)).toHaveCount(1)
  })
}

const copy = {
  en: { indexing: "From saved content", paths: "Three paths", terms: "stemming", source: "meeting transcripts" },
  ru: { indexing: "От сохранённого текста", paths: "Три пути", terms: "стемминг", source: "расшифровок встреч" },
  es: {
    indexing: "Del contenido guardado",
    paths: "Tres vías",
    terms: "stemming",
    source: "transcripciones de reuniones",
  },
}

for (const lang of ["en", "ru", "es"] as const) {
  for (const width of [390, 1280]) {
    test(`${lang}: search architecture stays readable at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: width === 390 ? "dark" : "light" })
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/${lang}/docs/search-architecture`)
      const figures = page.locator("main figure[aria-label]")
      await expect(figures).toHaveCount(4)
      await expect(figures.nth(0)).toContainText(copy[lang].indexing)
      await expect(figures.nth(1)).toContainText(copy[lang].paths)
      await expect(figures.nth(1)).toContainText("Discovery")
      await expect(figures.nth(2)).toContainText("Snowball")
      await expect(figures.nth(2)).toContainText("BM25")
      await expect(page.locator("main")).toContainText(copy[lang].source)
      await expect(page.locator(`main a[href="/${lang}/docs/search"]`)).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      const accessibility = await new AxeBuilder({ page }).include("main").analyze()
      expect(accessibility.violations).toEqual([])
      const guide = page.locator(`main a[href="/${lang}/docs/search"]`)
      await guide.focus()
      await expect(guide).toBeFocused()
      if (lang === "en") {
        await figures.nth(0).scrollIntoViewIfNeeded()
        await page.screenshot({ path: `.docs-tooling/search-indexing-${width}.png` })
      }
    })
  }

  test(`${lang}: search architecture retains its meaning in Markdown`, async ({ request }) => {
    const locale = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${locale}search-architecture/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain(copy[lang].source)
    expect(markdown).toContain(copy[lang].terms)
    expect(markdown).toContain(copy[lang].indexing)
    expect(markdown).toContain(copy[lang].paths)
    expect(markdown).toContain("Snowball")
    expect(markdown).toContain("BM25")
    expect(markdown).toContain("search all")
    expect(markdown).toContain("--discover")
    expect(markdown).not.toContain("<ArchitectureDiagram")
  })
}

test("en: the data model diagram enlarges and Esc closes it", async ({ page }) => {
  await page.goto("/en/docs/data-model")
  const dialog = page.getByRole("dialog")
  // The served button looks the same before its click handler is attached, so retry until a click opens it.
  await expect(async () => {
    await page.getByRole("button", { name: "Enlarge diagram" }).first().click({ timeout: 1_000 })
    await expect(dialog).toBeVisible({ timeout: 1_000 })
  }).toPass()
  await expect(dialog.getByRole("button", { name: "Close" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
})
