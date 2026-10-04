import { expect, test } from "@playwright/test"

const languages = ["en", "ru", "es"] as const
const labels = {
  en: {
    local: "More about: local agent",
    title: "Local agent",
    close: "Close explanation",
    screenshot: "See the my.telegram.org login screen",
    copy: "Copy: Prompt",
  },
  ru: {
    local: "Подробнее: локального агента",
    title: "Локальный агент",
    close: "Закрыть пояснение",
    screenshot: "Посмотреть экран входа my.telegram.org",
    copy: "Скопировать: Промпт",
  },
  es: {
    local: "Más sobre: agente local",
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
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto(`/${lang}/docs/installation#tg`)
    for (const tool of ["tg", "max"]) {
      const details = page.locator(`details#${tool}`)
      if (!(await details.evaluate((element) => (element as HTMLDetailsElement).open)))
        await details.locator(":scope > summary").click()
      const text = await details.locator(".docs-prompt code").innerText()
      expect(text.split("\n")).toHaveLength(5)
      expect(text.length).toBeLessThan(550)
      expect(text).not.toMatch(/Windows|PATH|https:\/\/|--agent/u)
      await details.getByRole("button", { name: labels[lang].copy, exact: true }).click()
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(text)
    }
    await page.goto(`/${lang}/docs/tg/sessions`)
    await page.getByText(labels[lang].screenshot, { exact: true }).click()
    const image = page.locator('img[src="/telegram-app-login.png"]')
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBe(880)
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
}
