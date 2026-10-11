import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: Drive overview leads to installation beside messenger tools`, async ({ page }) => {
    await page.goto(`/${lang}/docs/drive`)
    await expect(page.getByRole("heading", { level: 1, name: "Google Drive", exact: true })).toBeVisible()
    await expect(page.locator(`a[href="/${lang}/docs/drive/installation"]`).first()).toBeVisible()
    await expect(page.locator("#nd-sidebar").locator(`a[href="/${lang}/docs/tg"]`)).toHaveCount(1)
    await expect(page.locator("#nd-sidebar").locator(`a[href="/${lang}/docs/max"]`)).toHaveCount(1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: Drive installation uses source build and Desktop consent`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/drive/installation`)
    const body = page.locator("main")
    await expect(body).toContainText("pnpm build")
    await expect(body).toContainText("Desktop app")
    await expect(body.locator('a[href="https://console.cloud.google.com/auth/branding"]')).toBeVisible()
    await expect(body.locator('a[href="https://console.cloud.google.com/auth/clients"]')).toBeVisible()
    await expect(body).toContainText("Download JSON")
    await expect(body).toContainText("Google Drive Activity API")
    await expect(body).not.toContainText("npm install -g @wirecat/drive-cli")
    await expect(page.locator("#agent-installation")).toHaveCount(0)
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}drive/installation/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("drive personal session start --client-file")
    expect(await markdown.text()).not.toContain("npm install -g @wirecat/drive-cli")
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

  test(`${lang}: organization guide links source-specific actions`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/organize`)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/drive/recipes"]`).first()).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/drive/configuration"]`).first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}
