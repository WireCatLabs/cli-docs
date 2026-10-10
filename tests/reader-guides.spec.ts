import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { observeExternalRequests } from "./site-network"

for (const lang of ["en", "ru", "es"]) {
  for (const tool of ["tg", "max"]) {
    for (const route of ["usage", "rankings", "bot", "groups"]) {
      test(`${lang}/${tool}/${route}: roles, visible commands and report examples match Markdown`, async ({
        page,
        request,
      }) => {
        test.setTimeout(60000) // One guide, one accessibility scan and its Markdown twin.
        const externalRequests = observeExternalRequests(page)
        const reference = page.locator("[data-technical-reference]")
        await page.setViewportSize({ width: 390, height: 900 })
        await test.step("Rendered guide and mobile layout", async () => {
          await page.goto(`/${lang}/docs/${tool}/${route}`)
          const guide = page.locator("[data-reader-guide]")
          await expect(guide).toBeVisible()
          await expect(guide.locator(".docs-copy").first()).toBeEnabled()
          await expect(guide.locator("[data-reader-roles] a")).toHaveCount(route === "bot" ? 0 : 3)
          if (route === "bot") {
            await expect(guide.locator("[data-bot-onboarding]")).toBeVisible()
            expect(
              await guide.evaluate((element) => {
                const setup = element.querySelector("[data-bot-onboarding]")
                const check = element.querySelector("[data-reader-section=task-bot-check]")
                return Boolean(
                  setup && check && setup.compareDocumentPosition(check) & Node.DOCUMENT_POSITION_FOLLOWING,
                )
              }),
            ).toBe(true)
          }
          await expect(reference).toBeVisible()
          await expect(reference.locator("details")).toHaveCount(0)
          if (route === "rankings") {
            await expect(page.locator("[data-report-fixture] tbody tr")).toHaveCount(3)
            await expect(page.locator("[data-report-activity] li")).toHaveCount(7)
            await expect(page.locator("[data-report-fixture]")).toContainText("684")
            await expect(guide.locator("[data-reader-section]")).toHaveCount(8)
            await expect(guide.locator("[data-reader-section=task-person] table")).toBeVisible()
            await expect(guide.locator("[data-reader-section=task-antibot] table")).toBeVisible()
            const dailyCounts = await page.locator("[data-report-activity] li > span:first-child").allTextContents()
            const groupCounts = await page.locator("[data-report-fixture] tbody td:nth-child(2)").allTextContents()
            expect(dailyCounts.reduce((sum, value) => sum + Number(value), 0)).toBe(684)
            expect(groupCounts.reduce((sum, value) => sum + Number(value), 0)).toBe(684)
          }
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        })
        await test.step("Accessibility", async () => {
          const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()
          expect(scan.violations).toEqual([])
        })
        await test.step("Direct reference anchor", async () => {
          const id = await reference.locator("h2[id]").first().getAttribute("id")
          expect(id).toBeTruthy()
          await page.goto(`/${lang}/docs/${tool}/${route}#${encodeURIComponent(id ?? "")}`)
          await expect(reference).toBeVisible()
        })
        await test.step("Markdown parity", async () => {
          const md = await request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}${tool}/${route}/content.md`, {
            timeout: 10000,
          })
          expect(md.status()).toBe(200)
          const text = await md.text()
          expect(text).toContain(tool === "tg" ? "Telegram" : "MAX")
          expect(text).toContain(
            route === "usage"
              ? `${tool} messages send`
              : route === "rankings"
                ? `${tool} stats`
                : route === "bot"
                  ? `${tool} bot`
                  : `${tool} chats`,
          )
          expect(text).not.toContain("<ReaderGuide")
          if (route === "rankings") expect(text).toContain("684")
        })
        expect(externalRequests, "Static guide must not request external services").toEqual([])
      })
    }
  }
}
