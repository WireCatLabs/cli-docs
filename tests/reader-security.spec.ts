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

const manualInstall = { en: "Or install it yourself", ru: "Или установите самостоятельно", es: "O instálalo tú mismo" }
for (const lang of ["en", "ru", "es"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`${lang}: Memo requests use the command background in ${theme} mode`, async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"])
      await page.emulateMedia({ colorScheme: theme })
      await page.setViewportSize({ width: 390, height: 900 })
      await page.goto(`/${lang}/docs/memo`)
      const prompt = page.locator("main .docs-prompt").filter({ hasText: "npm install -g @wirecat/cli-memo" }).first()
      await expect(prompt).toBeVisible()
      await page.getByRole("button", { name: manualInstall[lang], exact: true }).click()
      const command = page
        .locator("main .docs-code-block")
        .filter({ hasText: "npm install -g @wirecat/cli-memo" })
        .first()
      await expect(command).toBeVisible()
      const background = await command.evaluate((element) => getComputedStyle(element).backgroundColor)
      expect(background).not.toBe("rgba(0, 0, 0, 0)")
      expect(await prompt.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(background)
      expect(
        await prompt.locator(".docs-snippet-bar").evaluate((element) => getComputedStyle(element).backgroundColor),
      ).toBe("rgba(0, 0, 0, 0)")
      await prompt.locator("button.docs-copy").click()
      const request = await prompt.locator("code").innerText()
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(request)

      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      const response = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}memo/content.md`)
      expect(response.ok()).toBe(true)
      const markdown = await response.text()
      expect(markdown).toContain("npm install -g @wirecat/cli-memo")
      expect(markdown).toContain("npm.cmd install -g @wirecat/cli-memo")

      if (lang === "en") await page.screenshot({ path: `.docs-tooling/memo-request-${theme}.png` })
    })
  }
}
