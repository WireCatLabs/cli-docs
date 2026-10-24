import { expect, test } from "@playwright/test"

const pages = [
  { tool: "tg", first: "agent-without-send", command: "tg sends list", crossTool: true },
  { tool: "max", first: "agent-on-a-timer", command: "max review 'date>1d' --unanswered 4h", crossTool: true },
  { tool: "drive", first: "agent-access", command: "drive personal mcp --read-only", crossTool: true },
  { tool: "zm", first: "archive-recordings", command: "zm personal recordings schedule run daily", crossTool: true },
  { tool: "memo", first: "decision-trail", command: "tg contacts context Kai", crossTool: false },
]
const headings = { en: "Step-by-step scenarios", ru: "Пошаговые сценарии", es: "Escenarios paso a paso" }
const terminal = { en: "In the terminal:", ru: "В терминале:", es: "En la terminal:" }

for (const lang of ["en", "ru", "es"] as const)
  for (const { tool, first, command, crossTool } of pages)
    test(`${lang}: ${tool} scenarios show copyable steps, the guide command and cross-tool links`, async ({
      page,
      request,
    }) => {
      await page.goto(`/${lang}/docs/${tool}/scenarios`)
      const body = page.locator("main")
      await expect(page.getByRole("heading", { level: 1, name: headings[lang] })).toBeVisible()
      await expect(page.locator(`#${first}`)).toHaveCount(1)
      const step = body.locator("pre").filter({ hasText: command })
      await expect(step).toBeVisible()
      await expect(step.locator("xpath=ancestor::figure[1]").getByRole("button").first()).toBeAttached()
      await expect(body).toContainText(`${terminal[lang]} ${tool} guide ${first}`)
      await expect(
        page.locator("#nd-sidebar").locator(`a[href="/${lang}/docs/${tool}/scenarios"]`, { hasText: headings[lang] }),
      ).toHaveCount(1)
      if (crossTool) await expect(body.locator(`a[href="/${lang}/docs/memo/scenarios#person-brief"]`)).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      const prefix = lang === "en" ? "" : `${lang}/`
      const markdown = await request.get(`/llms.mdx/docs/${prefix}${tool}/scenarios/content.md`)
      expect(markdown.ok()).toBe(true)
      expect(await markdown.text()).toContain(command)
    })
