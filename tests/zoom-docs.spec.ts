import { expect, test } from "@playwright/test"

const titles = { en: "Meetings", ru: "Встречи", es: "Reuniones" }
for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: Zoom sits beside Drive and opens its setup guide`, async ({ page }) => {
    await page.goto(`/${lang}/docs/zm`)
    await expect(page.getByRole("heading", { level: 1, name: "Zoom", exact: true })).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/zm/installation"]`).first()).toBeVisible()
    const links = await page
      .locator("#nd-sidebar a[href]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))
    const roots = links.filter((href) => new RegExp(`^/${lang}/docs/(tg|max|drive|zm|memo)/?$`).test(href ?? ""))
    const drive = roots.indexOf(`/${lang}/docs/drive`)
    expect(drive).toBeGreaterThan(-1)
    expect(roots[drive + 1]).toBe(`/${lang}/docs/zm`)
    await expect(page.locator(`#nd-sidebar a[href="/${lang}/docs/zoom"]`)).toHaveText(titles[lang])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: contextual search filters remain readable on mobile and in Markdown`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zm/search`)
    await expect(page.locator("main")).toContainText("--identity-id")
    await expect(page.locator("main")).toContainText("--person-id")
    await expect(page.locator("main")).toContainText("--project")
    await expect(page.locator(`main a[href="/${lang}/docs/memo/usage"]`).first()).toBeVisible()
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}zm/search/content.md`)
    expect(markdown.ok()).toBe(true)
    const text = await markdown.text()
    expect(text).toContain('zm meetings search-page "launch" --identity-id 12 --project RES')
    expect(text).toContain("meeting_search_page")
    expect(text).toContain("UTC")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: Meetings keeps its address and readable cross-source workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zoom`)
    await expect(page.getByRole("heading", { level: 1, name: titles[lang], exact: true })).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/zm/search"]`)).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/drive"]`)).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/memo"]`)).toBeVisible()
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}zoom/content.md`)
    expect(markdown.ok()).toBe(true)
    const text = await markdown.text()
    expect(text).toContain("Research Example")
    expect(text).toContain("zm meetings transcript 1 --json")
    expect(text).toContain("zm remote-meetings list --json")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: Zoom installation links its app and retains command examples in Markdown`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${lang}/docs/zm/installation`)
    await expect(page.locator("main")).toContainText("npm install -g @wirecat/zoom-cli")
    await expect(page.locator(`main a[href="/${lang}/docs/zm/zoom-app"]`).first()).toBeVisible()
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}zm/installation/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("zm config set zoom.clientId <public-client-id>")
    expect(await markdown.text()).toContain("zm login")
  })
}

for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: installation explains app choices, credentials and completed login`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/zm/installation`)
    const main = page.locator("main")
    await expect(main).toContainText("Public Client ID")
    await expect(main).toContainText(
      {
        en: "There is no credentials file to download",
        ru: "Файл учётных данных не нужен",
        es: "No hay archivo de credenciales",
      }[lang],
    )
    await expect(main).toContainText("WireCat")
    await expect(main).toContainText("loggedIn: true")
    await expect(main).toContainText("code=…&state=…")
    await expect(page.locator(`main a[href="/${lang}/docs/zm/zoom-app#create-your-own-app"]`)).toBeVisible()
    await expect(main).toContainText("OAuth Redirect URL")
    await expect(main).toContainText("OAuth Allow Lists")
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/installation/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain("zm config set zoom.clientId <public-client-id>")
    expect(markdown).toContain("zm config set source api")
    expect(markdown).toContain("zm session status --json")
    expect(markdown).toContain("code=…&state=…")
    expect(markdown).toContain("https://wirecat.dev/zoom-callback")
  })

  test(`${lang}: app guide has manual creation and existing app reuse with explicit scope setup`, async ({ page }) => {
    await page.goto(`/${lang}/docs/zm/zoom-app`)
    const main = page.locator("main")
    await expect(main).toContainText("General app")
    await expect(main).toContainText("User-managed")
    await expect(main).toContainText("Use Public Client OAuth")
    await expect(main).toContainText("Developer")
    await expect(main).toContainText("Created apps")
    await expect(main).toContainText("Local Test")
    await expect(main).toContainText("Add Scopes")
    await expect(main).toContainText(
      {
        en: "The manifest does not include scopes",
        ru: "Манифест не содержит разрешений",
        es: "El manifiesto no incluye permisos",
      }[lang],
    )
    await expect(main).toContainText("meeting:read:list_past_participants")
    await expect(page.locator(`main a[href="/${lang}/docs/zm/installation#first-run"]`).first()).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/zm/sessions#finish-the-browser-callback"]`)).toBeVisible()
    await expect(main.locator('a[href="https://marketplace.zoom.us/"]').first()).toBeVisible()
  })

  test(`${lang}: sessions exposes stalled approval recovery on mobile and in Markdown`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zm/sessions#finish-the-browser-callback`)
    const main = page.locator("main")
    await expect(main).toContainText("code=…&state=…")
    await expect(main).toContainText("loggedIn: true")
    await expect(main).toContainText("Enter")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/sessions/content.md`)
    expect(response.ok()).toBe(true)
    expect(await response.text()).toContain("code=…&state=…")
  })
}
