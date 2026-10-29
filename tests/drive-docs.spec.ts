import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: Drive overview leads to installation beside messenger tools`, async ({ page }) => {
    await page.goto(`/${lang}/docs/drive`)
    await expect(page.getByRole("heading", { level: 1, name: "Google Drive", exact: true })).toBeVisible()
    await expect(page.locator(`a[href="/${lang}/docs/drive/installation"]`).first()).toBeVisible()
    await expect(page.locator("main")).toContainText("SQLite")
    await expect(
      page.locator(`main a[href="/${lang}/docs/drive/usage#browse-and-organize-the-local-catalog"]`),
    ).toBeVisible()
    await expect(page.locator("#nd-sidebar").locator(`a[href="/${lang}/docs/tg"]`)).toHaveCount(1)
    await expect(page.locator("#nd-sidebar").locator(`a[href="/${lang}/docs/max"]`)).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: Drive installation uses npm or an agent and Desktop consent`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/drive/installation`)
    const body = page.locator("main")
    await expect(body).not.toContainText("pnpm build")
    await expect(body).toContainText("npm install -g @wirecat/drive-cli")
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /npm/)
    await expect(body).toContainText("Desktop app")
    // Optional app setup stays collapsed while the reader follows the three-step default path.
    const customApp = body.locator("#custom-google-app")
    await expect(customApp).not.toHaveAttribute("open", "")
    await expect(customApp.locator('a[href="https://console.cloud.google.com/auth/branding"]')).not.toBeVisible()
    await customApp.locator("summary").focus()
    await page.keyboard.press("Enter")
    await expect(customApp).toHaveAttribute("open", "")
    await customApp.locator("summary").click()
    await body.locator('a[href="#sign-in-with-your-own-client"]').first().click()
    await expect(customApp).toHaveAttribute("open", "")
    await expect(page.locator("#sign-in-with-your-own-client")).toHaveCount(1)
    await expect(
      customApp.locator("code").filter({ hasText: "drive personal session start --client-file" }),
    ).toBeVisible()
    await expect(customApp.locator('a[href="https://console.cloud.google.com/auth/branding"]')).toBeVisible()
    await expect(customApp.locator('a[href="https://console.cloud.google.com/auth/clients"]')).toBeVisible()
    await expect(body).toContainText("Download JSON")
    await expect(body).toContainText("Google Drive Activity API")
    await expect(page.locator("#agent-installation")).toHaveCount(0)
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}drive/installation/content.md`)
    expect(markdown.ok()).toBe(true)
    const text = await markdown.text()
    expect(text).toContain("npm install -g @wirecat/drive-cli")
    expect(text).not.toContain("pnpm build")
    const mainSteps = await body.locator("h2").allTextContents()
    expect(mainSteps.slice(0, 3).map((heading) => heading.trim().slice(0, 2))).toEqual(["1.", "2.", "3."])
    const manualInstall = body.locator("#option-b-install-by-hand")
    await body.locator('a[href="#connect-your-account"]').nth(1).click()
    await expect(page).toHaveURL(/#connect-your-account$/)
    // The agent branch explicitly hands off before the manual branch, rather than requiring both.
    const agentOption = text.indexOf("### ", text.indexOf("## 1."))
    const handoff = text.indexOf("(#connect-your-account)", agentOption)
    const manualOption = text.indexOf("### ", agentOption + 4)
    expect(handoff).toBeGreaterThan(agentOption)
    expect(handoff).toBeLessThan(manualOption)
    await expect(manualInstall).toHaveCount(1)
    // Users can finish shared-app sign-in and their first import before optional Cloud setup.
    const sharedSignIn = text.indexOf("drive personal session start\n")
    const sessionCheck = text.indexOf("session list --json", sharedSignIn)
    const firstImport = text.indexOf("drive personal folders add")
    const cloudSetup = text.indexOf("https://console.cloud.google.com/")
    const customSignIn = text.indexOf("drive personal session start --client-file")
    expect(sharedSignIn).toBeGreaterThan(-1)
    expect(sessionCheck).toBeGreaterThan(sharedSignIn)
    expect(firstImport).toBeGreaterThan(sessionCheck)
    expect(cloudSetup).toBeGreaterThan(firstImport)
    expect(customSignIn).toBeGreaterThan(cloudSetup)
    expect(text.indexOf("npm uninstall")).toBeGreaterThan(customSignIn)
    expect(text).toContain('<details id="custom-google-app">')
    expect(text.slice(customSignIn)).toContain("(#connect-your-account)")
    expect(text.slice(customSignIn)).toContain("(#approve-access-in-your-browser)")
    await expect(body.locator('a[href="#connect-your-account"]').last()).toBeVisible()
    await expect(page.locator("#connect-your-account")).toHaveCount(1)
    await expect(page.locator("#prepare-google-sign-in")).toHaveCount(1)
  })

  test(`${lang}: Drive changelog renders current and first released features`, async ({ page }) => {
    await page.goto(`/${lang}/docs/drive/changelog`)
    const title = { en: "Changelog", ru: "История изменений", es: "Historial de cambios" }[lang]
    await expect(page.getByRole("heading", { level: 1, name: title, exact: true })).toBeVisible()
    await expect(page.locator("main")).toContainText("0.1.0")
    await expect(page.locator("main")).toContainText("0.7.0")
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Google Drive/)
    await expect(page.locator("#nd-sidebar").getByRole("link", { name: title, exact: true })).toHaveAttribute(
      "href",
      `/${lang}/docs/drive/changelog`,
    )
  })

  test(`${lang}: Drive mirror guidance and file exports survive Markdown`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/drive/mirrors`)
    const body = page.locator("main")
    await expect(body).toContainText("drive personal mirrors add ./notes --parent FOLDER_ID")
    await expect(body).toContainText("--keep both")
    await expect(body).toContainText("XLSX")
    const prefix = lang === "en" ? "" : `${lang}/`
    const mirror = await request.get(`/llms.mdx/docs/${prefix}drive/mirrors/content.md`)
    expect(mirror.ok()).toBe(true)
    expect(await mirror.text()).toContain("drive personal mirrors remove MIRROR_ID")
    const usage = await request.get(`/llms.mdx/docs/${prefix}drive/usage/content.md`)
    expect(usage.ok()).toBe(true)
    expect(await usage.text()).toContain("drive personal files download FILE_ID --output ./download.bin")
    expect(await usage.text()).toContain("drive personal files export DOC_ID --format pdf --output ./document.pdf")
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Google/)
  })

  test(`${lang}: Drive remote guide preserves HTTP login and revocation in HTML and Markdown`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${lang}/docs/drive/remote`)
    const body = page.locator("main")
    await expect(body).toContainText("drive personal mcp serve --http --port 8765 --public-url")
    await expect(body).toContainText("drive personal mcp revoke --json")
    await expect(body).toContainText("DCR")
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Google Drive/)
    const remoteLink = page.locator("#nd-sidebar").getByRole("link", { name: /ChatGPT.*Claude/ })
    await expect(remoteLink).toHaveAttribute("href", `/${lang}/docs/drive/remote`)
    await expect(remoteLink).toBeVisible()
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}drive/remote/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("drive personal mcp revoke --json")
    await page.goto(`/${lang}/docs/drive/recipes`)
    await expect(page.locator("main")).toContainText("availability.available: false")
    await expect(page.locator(`main a[href="/${lang}/docs/drive/remote"]`).first()).toBeVisible()
  })

  test(`${lang}: Drive search preserves executable tagged-search examples`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/drive/search`)
    await expect(page.locator("main")).toContainText("budget AND tag:follow-up")
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}drive/search/content.md`)
    expect(markdown.ok()).toBe(true)
    const text = await markdown.text()
    expect(text).toContain("drive personal search 'budget AND tag:follow-up' --exact --json")
    expect(text).toContain("--limit 10 --page 1 --json")
    expect(text).not.toContain("--offset 0")
  })

  test(`${lang}: Drive distinguishes managed cache from extra exports`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/drive/usage`)
    const body = page.locator("main")
    await expect(body).toContainText("drive personal documents get DOC_ID")
    await expect(body).toContainText("drive personal documents export DOC_ID")
    await expect(body).toContainText("DRIVE_STATE_DIR")
    await expect(body).toContainText("PDF")
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}drive/usage/content.md`)
    expect(markdown.ok()).toBe(true)
    await expect(page.locator("#import-a-folder")).toHaveCount(1)
    expect(await markdown.text()).toContain("drive personal documents export DOC_ID")
    expect(await markdown.text()).toContain("drive personal catalog tree --offline")
    expect(await markdown.text()).toContain("provider_metadata")
    expect(await markdown.text()).toContain("`effects`")
    expect(await markdown.text()).toContain("`api_operation`")
    expect(await markdown.text()).toContain("`4`")
    expect(await markdown.text()).toContain("`error.retry.safe`")
    const text = await markdown.text()
    expect(text).toContain("--json=id,name")
    expect(text).toContain("drive personal documents export DOC_ID --output ./decision.md")
    expect(text.lastIndexOf("drive personal documents export DOC_ID --output ./decision.md")).toBeLessThan(
      text.indexOf("--json=id,name"),
    )
  })

  test(`${lang}: Drive settings separate saved choices, environment and invocation options`, async ({ page }) => {
    await page.goto(`/${lang}/docs/drive/configuration`)
    const body = page.locator("main")
    await expect(body.locator("table")).toHaveCount(4)
    await expect(body.locator("table").nth(0)).toContainText("config.json")
    await expect(body.locator("table").nth(1)).toContainText("models.memories.provider")
    await expect(body.locator("table").nth(1)).not.toContainText("DRIVE_CONFIG_DIR")
    await expect(body.locator("table").nth(2)).toContainText("DRIVE_CONFIG_DIR")
    await expect(body.locator("table").nth(3)).toContainText("--offline")
    await expect(body.locator("table").nth(3)).not.toContainText("--agent-json")
  })

  test(`${lang}: Drive recipes preserve offline and full metadata workflows in Markdown`, async ({ request }) => {
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}drive/recipes/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain("drive personal --offline documents context DOC_ID --json")
    expect(markdown).toContain("drive personal files get FILE_ID --json > ./file-metadata.json")
    expect(markdown).toContain("drive personal catalog tags add FOLDER_ID follow-up --offline")
    expect(markdown).toContain("drive personal documents list tag:follow-up --json")
    expect(markdown).toContain("drive personal memories extract DOC_ID --scope work --yes")
    expect(markdown).toContain("drive personal memories list DOC_ID scope:work --json")
    expect(markdown).toContain("drive personal facts list DOC_ID status:proposed --json")
    expect(markdown).toContain("session start --client-file /path/to/desktop-client.json --grant activity")
    expect(markdown).toContain("session start --client-file /path/to/desktop-client.json --grant write")
  })

  test(`${lang}: organization guide links source-specific actions`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/organize`)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/drive/recipes"]`).first()).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/drive/configuration"]`).first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}
