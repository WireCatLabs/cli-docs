import { expect, test } from "@playwright/test"

const words = {
  en: { privacy: "Privacy Policy", terms: "Terms of Service", google: "Google account access" },
  ru: { privacy: "Политика конфиденциальности", terms: "Условия использования", google: "Доступ к аккаунту Google" },
  es: { privacy: "Política de privacidad", terms: "Términos de servicio", google: "Acceso a la cuenta de Google" },
}

for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: legal footer links work without JavaScript and disclose Google access`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await page.goto(lang === "en" ? "/" : `/${lang}`)
    const footer = page.locator("footer.site")
    await expect(footer.locator(`a[href="/${lang}/privacy"]`)).toBeVisible()
    await expect(footer.locator(`a[href="/${lang}/terms"]`)).toBeVisible()
    await footer.locator(`a[href="/${lang}/privacy"]`).click()
    await expect(page.locator("main h1")).toHaveText(words[lang].privacy)
    await expect(page.locator("#google-access h2")).toHaveText(words[lang].google)
    await expect(page.locator("#sharing-ai")).toBeVisible()
    await expect(page.locator("#disconnect-delete")).toBeVisible()
    await expect(page.locator("#google-limited-use")).toContainText("Google API Services User Data Policy")
    await expect(page.locator('main a[href="https://myaccount.google.com/connections"]')).toBeVisible()
    await expect(page.locator('main a[href="mailto:hello@wirecat.dev"]')).toBeVisible()
    await page.locator(`main a[href="/${lang}/terms"]`).click()
    await expect(page.locator("main h1")).toHaveText(words[lang].terms)
    await expect(page.locator(`main a[href="/${lang}/privacy"]`)).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://wirecat.dev/${lang}/terms`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.goto(`/${lang}/docs/drive`)
    await expect(page.locator(`footer.site a[href="/${lang}/privacy"]`)).toBeVisible()
    await expect(page.locator(`footer.site a[href="/${lang}/terms"]`)).toBeVisible()
    await context.close()
  })
}
