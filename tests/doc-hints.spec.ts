import { expect, test } from "@playwright/test"
import { wordsFor } from "../lib/words"

const languages = ["en", "ru", "es"] as const
const labels = {
  en: {
    local: "More about: AI agent",
    title: "Local agent",
    close: "Close explanation",
    screenshot: "See the my.telegram.org login screen",
    copy: "Copy: Prompt",
  },
  ru: {
    local: "Подробнее: ИИ-агента",
    title: "Локальный агент",
    close: "Закрыть пояснение",
    screenshot: "Посмотреть экран входа my.telegram.org",
    copy: "Скопировать: Промпт",
  },
  es: {
    local: "Más sobre: agente de IA",
    title: "Agente local",
    close: "Cerrar explicación",
    screenshot: "Ver la pantalla de acceso de my.telegram.org",
    copy: "Copiar: Prompt",
  },
}

for (const lang of languages) {
  test(`${lang}: term explanation opens on hover and keyboard, keeps a localized guide link and closes with Escape`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/docs/installation`)
    const trigger = page.getByRole("button", { name: labels[lang].local, exact: true })
    await expect(trigger).toBeEnabled()
    await trigger.hover()
    const popup = page.locator(".docs-term-popup")
    await expect(popup).toBeVisible()
    await expect(popup).toContainText("Claude Code, Codex, Cursor")
    await expect(popup.locator("a")).toHaveAttribute("href", `/${lang}/docs/agents`)
    await page.keyboard.press("Escape")
    await expect(popup).not.toBeVisible()
    await page.mouse.move(0, 0)
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(popup).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(popup).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test(`${lang}: touch users can open and dismiss explanations without horizontal overflow`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL,
      viewport: { width: 360, height: 800 },
      hasTouch: true,
      isMobile: true,
    })
    try {
      const page = await context.newPage()
      await page.goto(`/${lang}/docs/installation`)
      await page.getByRole("button", { name: labels[lang].local, exact: true }).tap()
      const popup = page.locator(".docs-term-popup")
      await expect(popup).toBeVisible()
      const box = await popup.boundingBox()
      expect(box).not.toBeNull()
      expect(box?.x).toBeGreaterThanOrEqual(0)
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(360)
      await popup.getByRole("button", { name: labels[lang].close }).tap()
      await expect(popup).not.toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    } finally {
      await context.close()
    }
  })

  test(`${lang}: copied requests are short and match visible text; browser authentication screenshot is reachable`, async ({
    page,
    context,
  }) => {
    // Five pages and two Markdown routes, each compiled on first request by the dev server in CI.
    test.slow()
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto(`/${lang}/docs/installation#tg`)
    for (const tool of ["tg", "max"]) {
      await page
        .getByRole("tab", { name: tool === "tg" ? "Telegram" : "MAX", exact: true })
        .first()
        .click()
      const prompt = page.locator(".docs-prompt").filter({ hasText: `npm install -g @leemour/${tool}-cli` })
      await expect(prompt.locator(".docs-copy")).toBeEnabled()
      await expect(prompt.locator("code")).toBeVisible()
      const text = await prompt.locator("code").innerText()
      expect(text.split("\n")).toHaveLength(5)
      expect(text.length).toBeLessThan(550)
      expect(text).not.toMatch(/Windows|PATH|https:\/\/|--agent/u)
      await prompt.getByRole("button", { name: labels[lang].copy, exact: true }).click()
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(text)
    }
    await page.goto(`/${lang}/docs/tg/sessions`)
    await page.getByText(labels[lang].screenshot, { exact: true }).click()
    const image = page.locator('img[src="/telegram-app-login.png"]')
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBe(1040)
    const markdownPath = `/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`
    const response = await page.request.get(markdownPath)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain("Claude Code, Codex, Cursor")
    expect(markdown).not.toContain("<DocTerm")
    const sessions = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}tg/sessions/content.md`)
    expect(sessions.ok()).toBe(true)
    const sessionsText = await sessions.text()
    expect(sessionsText).toContain("/telegram-app-login.png")
    expect(sessionsText).not.toContain("__img")
  })
  test(`${lang}: getting started leads with the outcome; links stay unadorned and Node setup is copyable`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto(`/${lang}/docs`)
    const intro = await page.locator(".prose > p,.fd-prose > p").first().innerText()
    expect(intro).not.toMatch(/WireCat|CLI|Node\.js|npm/u)
    expect(intro).toContain("Telegram")
    expect(intro).toContain("MAX")
    const definitions = [
      {
        label: { en: "AI agent", ru: "ИИ-агенту", es: "agente de IA" }[lang],
        page: "agents",
      },
      { label: "cli", page: "installation" },
      { label: "skill", page: "agents" },
      { label: "MCP", page: "mcp" },
    ]
    await expect(page.locator(".docs-term-trigger")).toHaveCount(4)
    for (const definition of definitions) {
      const prefix = { en: "More about", ru: "Подробнее", es: "Más sobre" }[lang]
      const trigger = page.getByRole("button", { name: `${prefix}: ${definition.label}`, exact: true })
      await expect(trigger).toBeEnabled()
      await trigger.focus()
      await page.keyboard.press("Enter")
      const popup = page.locator(".docs-term-popup")
      await expect(popup).toBeVisible()
      await expect(popup.locator("a")).toHaveAttribute("href", `/${lang}/docs/${definition.page}`)
      expect(await popup.locator("a").evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe("none")
      await page.keyboard.press("Escape")
      await expect(popup).not.toBeVisible()
      await expect(trigger).toBeFocused()
    }
    const homeMarkdown = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}content.md`)
    expect(homeMarkdown.ok()).toBe(true)
    expect(await homeMarkdown.text()).not.toContain("<DocTerm")
    const links = page.locator(".wirecat-docs a")
    const styles = await links.evaluateAll((elements) =>
      elements.filter((el) => el.getClientRects().length).map((el) => getComputedStyle(el).textDecorationLine),
    )
    expect(styles.length).toBeGreaterThan(10)
    for (const style of styles) expect(style).toBe("none")
    const guide = page
      .locator(`.prose a[href="/${lang}/docs/installation"],.fd-prose a[href="/${lang}/docs/installation"]`)
      .first()
    await guide.hover()
    expect(await guide.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe("none")
    await guide.focus()
    expect(await guide.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe("none")
    await page.goto(`/${lang}/docs/installation#nodejs`)
    const node = page.getByRole("button", { name: /: Node\.js$/u }).first()
    await expect(node).toBeEnabled()
    await node.click()
    await expect(page.locator(".docs-term-popup")).toBeVisible()
    await expect(page.locator(".docs-term-popup a")).toHaveAttribute("href", `/${lang}/docs/installation#nodejs`)
    await page.keyboard.press("Escape")
    const prompt = page.locator(".docs-prompt").filter({ hasText: "node --version" })
    await expect(prompt.locator(".docs-copy")).toBeEnabled()
    expect(await prompt.locator("code").innerText()).toBe(wordsFor(lang).onboarding.nodePrompt)
    await prompt.locator(".docs-copy").click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(wordsFor(lang).onboarding.nodePrompt)
    const response = await page.request.get(`/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain(wordsFor(lang).onboarding.nodePrompt)
    expect(markdown).not.toContain("<NodeSetupPrompt")
    expect(markdown).not.toContain("https://nodejs.org/en/download")
    for (const source of [markdown, wordsFor(lang).onboarding.nodePrompt]) expect(source).toContain("npm --version")
  })
}
