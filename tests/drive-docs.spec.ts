import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: Drive overview leads to installation beside messenger tools`, async ({ page }) => {
    await page.goto(`/${lang}/docs/drive`)
    await expect(page.getByRole("heading", { level: 1, name: "Google Drive", exact: true })).toBeVisible()
    await expect(page.locator(`a[href="/${lang}/docs/drive/installation"]`).first()).toBeVisible()
    await expect(page.locator("main")).toContainText("SQLite")
    await expect(
      page.locator(`main a[href="/${lang}/docs/drive/recipes#save-full-available-metadata-for-offline-use"]`),
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
    await expect(body).toContainText("Desktop app")
    await expect(body.locator('a[href="https://console.cloud.google.com/auth/branding"]')).toBeVisible()
    await expect(body.locator('a[href="https://console.cloud.google.com/auth/clients"]')).toBeVisible()
    await expect(body).toContainText("Download JSON")
    await expect(body).toContainText("Google Drive Activity API")
    await expect(page.locator("#agent-installation")).toHaveCount(0)
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}drive/installation/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("drive personal session start --client-file")
    expect(await markdown.text()).toContain("npm install -g @wirecat/drive-cli")
    expect(await markdown.text()).not.toContain("pnpm build")
  })

  test(`${lang}: Drive search preserves executable tagged-search examples`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/drive/search`)
    await expect(page.locator("main")).toContainText("budget AND tag:follow-up")
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}drive/search/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("drive personal search 'budget AND tag:follow-up' --exact --json")
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
  })

  test(`${lang}: Drive recipes preserve offline and full metadata workflows in Markdown`, async ({ request }) => {
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}drive/recipes/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain("drive personal --offline documents context DOC_ID --json")
    expect(markdown).toContain("drive personal files get FILE_ID --json > ./file-metadata.json")
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
