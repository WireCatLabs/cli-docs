import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.setTimeout(90000)

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: landing and long references render without accessibility or browser failures`, async ({ page }) => {
    // Six full-page axe scans include the generated command reference (~1.8 MB HTML).
    test.setTimeout(180000)
    const errors: string[] = []
    const failed: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("response", (response) => {
      if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`)
    })
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const path of [
        lang === "en" ? "/" : `/${lang}`,
        `/${lang}/docs/tg/installation`,
        `/${lang}/docs/max/commands`,
      ]) {
        const response = await page.goto(path)
        expect(response?.status(), path).toBe(200)
        await page.evaluate(() => document.fonts.ready)
        if (path === (lang === "en" ? "/" : `/${lang}`)) await expect(page.locator(".sp-input")).toBeEditable()
        await expect(page.locator("h1")).toHaveCount(1)
        await expect(page.locator("main")).toHaveCount(1)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path).toBe(true)
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"])
          .analyze()
        expect(result.violations, `${path} at ${width}px`).toEqual([])
      }
    }
    expect(errors).toEqual([])
    expect(failed).toEqual([])
  })
}

test("documentation search loads on demand and mobile navigation dismisses with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/en/docs/tg/installation")
  const toc = page.locator("#nd-toc-popover details")
  await toc.locator("summary").click()
  await expect(toc).toHaveAttribute("open", "")
  await toc.locator("a").first().focus()
  await page.keyboard.press("Escape")
  await expect(toc).not.toHaveAttribute("open", "")
  await expect(toc.locator("summary")).toBeFocused()
  const menu = page.locator('#nd-subnav button[aria-controls="nd-sidebar-mobile"]')
  await menu.click()
  await expect(menu).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await expect(menu).toHaveAttribute("aria-expanded", "false")
  await expect(menu).toBeFocused()
  const search = page
    .locator("#nd-subnav")
    .getByRole("button", { name: /search/i })
    .first()
  await search.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await dialog.getByRole("combobox").fill("installation")
  await expect(dialog.getByRole("option").first()).toBeVisible()
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"]).analyze()
  expect(result.violations).toEqual([])
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
})

test("agent resources stay native documents when opened from the landing", async ({ page }) => {
  await page.goto("/")
  await page.locator('footer a[href="/llms.txt"]').click()
  await expect(page).toHaveURL(/\/llms\.txt$/)
  await expect(page.locator("body")).toContainText("# CLI tools")
  const response = await page.request.get("/sitemap.xml")
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain("https://wirecat.dev/en/docs/tg/installation")
})

test("dark landing text retains contrast at desktop and mobile widths", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" })
  for (const lang of ["en", "ru", "es"]) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(lang === "en" ? "/" : `/${lang}`)
      await expect(page.locator(".sp-input")).toBeEditable()
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
        .analyze()
      expect(result.violations, `${lang} dark at ${width}px`).toEqual([])
    }
  }
})

test("documentation preloads its licensed font without adding it to landing downloads", async ({ request }) => {
  for (const lang of ["en", "ru", "es"]) {
    const home = await (await request.get(lang === "en" ? "/" : `/${lang}`)).text()
    expect(home).not.toMatch(/<link[^>]+href="\/fonts\/docs-inter\/[^>]+as="font"/)
    const docs = await (await request.get(`/${lang}/docs/tg/commands`)).text()
    expect(docs).toMatch(/<link[^>]+href="\/fonts\/docs-inter\/inter-latin\.woff2"[^>]+as="font"/)
    if (lang === "ru") expect(docs).toMatch(/<link[^>]+href="\/fonts\/docs-inter\/inter-cyrillic\.woff2"[^>]+as="font"/)
  }
  const font = await request.get("/fonts/docs-inter/inter-latin.woff2")
  expect(font.status()).toBe(200)
  expect((await font.body()).subarray(0, 4).toString()).toBe("wOF2")
})

test("landing fonts are discoverable in initial HTML and match each locale", async ({ request }) => {
  for (const lang of ["en", "ru", "es"]) {
    const html = await (await request.get(lang === "en" ? "/" : `/${lang}`)).text()
    const preloads = [...html.matchAll(/<link[^>]+href="([^"]+)"[^>]+as="font"[^>]*>/g)].map((match) => match[1])
    expect(preloads).toContain("/fonts/gNMKW3F-SZuj7xmf-HY.woff2")
    expect(preloads).toContain("/fonts/heading-lab/unbounded-latin.woff2")
    expect(preloads.includes("/fonts/heading-lab/unbounded-cyrillic.woff2")).toBe(lang === "ru")
    expect(preloads.includes("/fonts/gNMKW3F-SZuj7xmb-HY6EQ.woff2")).toBe(lang === "ru")
    for (const font of preloads) {
      const response = await request.get(font)
      expect(response.status()).toBe(200)
      expect((await response.body()).subarray(0, 4).toString()).toBe("wOF2")
    }
  }
})

for (const lang of ["en", "ru", "es"]) {
  for (const tool of ["tg", "max"]) {
    test(`${lang}/${tool}: reference scrolling groups preserve tables, anchors and printing without landmark overload`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`/${lang}/docs/${tool}/commands`)
      const tables = page.locator(".docs-reference-table")
      expect(await tables.count()).toBeGreaterThan(10)
      expect(await tables.first().getAttribute("role")).toBe("group")
      expect(await tables.first().evaluate((element) => getComputedStyle(element).contentVisibility)).toBe("visible")
      const cdp = await page.context().newCDPSession(page)
      const tree = await cdp.send("Accessibility.getFullAXTree")
      expect(tree.nodes.filter((node) => node.role?.value === "region")).toHaveLength(0)
      expect(tree.nodes.filter((node) => node.role?.value === "table")).toHaveLength(
        await page.locator(".prose table").count(),
      )
      const heading = page.locator(".prose h3[id]").last()
      const id = await heading.getAttribute("id")
      await page.goto(`/${lang}/docs/${tool}/commands#${id}`)
      await expect(heading).toBeInViewport()
      await tables.last().scrollIntoViewIfNeeded()
      await tables.last().focus()
      await expect(tables.last()).toBeFocused()
      expect(await tables.last().innerText()).not.toBe("")
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      await page.emulateMedia({ media: "print" })
      expect(await tables.first().evaluate((element) => getComputedStyle(element).contentVisibility)).toBe("visible")
    })
  }
  test(`${lang}: successful copy has an independent live status and restores its button name after a demo change`, async ({
    page,
  }) => {
    await page.addInitScript(() =>
      Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => {} } }),
    )
    await page.goto(lang === "en" ? "/" : `/${lang}`)
    await page.locator(".hero .agent-connect summary").click()
    const button = page.locator(".hero .connect-choice").first()
    await button.click()
    const copied = { en: "Copied", ru: "Скопировано", es: "Copiado" }[lang]
    await expect(button).toHaveAccessibleName(`Telegram: ${copied}`)
    await expect(page.locator('main > p[role="status"]')).toHaveText(`Telegram: ${copied}`)
    await page.keyboard.press("Escape")
    await page.locator('[data-messenger="max"]').click()
    await page.locator(".hero .agent-connect summary").click()
    const original = { en: "Copy", ru: "Копировать", es: "Copiar" }[lang]
    await expect(button).toHaveAccessibleName(`Telegram: ${original}`)
  })
}

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: meeting scenario waits for Send, shows commands and follows up`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/meeting-brief`)
    const scenario = page.locator("[data-meeting-scenario]")
    const send = { en: "Send", ru: "Отправить", es: "Enviar" }[lang]
    await expect(scenario.locator("details.tool")).toHaveCount(0)
    await expect(scenario.locator("input")).toHaveCount(0)
    await scenario.getByRole("button", { name: send, exact: true }).click()
    await expect(scenario.locator(".meeting-step > .ask")).toHaveCount(1)
    await expect(scenario.locator("details.tool.running")).toBeVisible()
    await expect(scenario.locator("[data-meeting-pending]")).toBeVisible()
    await expect(scenario.locator("details.tool")).toHaveCount(2)
    await expect(scenario.locator("details.tool code").first()).toContainText("tg chats list")
    await scenario.locator("details.tool > summary").first().click()
    await expect(scenario.locator("details.tool pre").first()).toBeVisible()
    for (let i = 0; i < 2; i++) {
      await scenario.getByRole("button", { name: send, exact: true }).click()
      if (i === 0) await expect(scenario.locator("[data-meeting-pending]")).toBeVisible()
      else await expect(scenario.locator("[data-meeting-pending]")).toHaveCount(0)
    }
    await expect(scenario.locator(".say")).toHaveCount(3)
    await scenario.locator(".sources-toggle").last().click()
    await scenario.locator(".evidence-message > summary").last().click()
    await expect(scenario.locator(".evidence-message blockquote").last()).toBeVisible()
    await scenario.getByRole("button", { name: "MAX", exact: true }).click()
    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect(scenario.locator("details.tool")).toHaveCount(0)
    await scenario.getByRole("button", { name: send, exact: true }).click()
    await expect(scenario.locator("[data-meeting-pending]")).toBeVisible()
    await expect(scenario.locator("details.tool code").first()).toContainText("max chats list")
    expect(
      await scenario
        .locator(".meeting-step > .ask")
        .first()
        .evaluate((element) => getComputedStyle(element).animationName),
    ).toBe("none")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([])
    const locale = lang === "en" ? "" : `${lang}/`
    const markdown = await (await request.get(`/llms.mdx/docs/${locale}meeting-brief/content.md`)).text()
    expect(markdown).toContain("tg chats list")
    expect(markdown).not.toContain("<MeetingGuide")
    expect(markdown).toContain("```text prompt")
  })
}

test("the public project contact opts out of an unnecessary edge email decoder", async ({ request }) => {
  const html = await (await request.get("/")).text()
  expect(html).toContain('<!--email_off--><a href="mailto:hello@wirecat.dev">hello@wirecat.dev</a><!--/email_off-->')
})

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: session recovery links remain distinguishable inside callouts`, async ({ page }) => {
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme })
      await page.goto(`/${lang}/docs/tg/sessions`)
      await expect(page.locator("html")).toHaveClass(colorScheme === "dark" ? /dark/ : /light/)
      expect((await new AxeBuilder({ page }).withRules(["link-in-text-block"]).analyze()).violations).toEqual([])
    }
  })
}
