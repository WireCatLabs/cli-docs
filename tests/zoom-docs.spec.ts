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
