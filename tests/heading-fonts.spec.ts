import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"]) {
  test(`${lang}: selected editorial typography loads locally without a public design switcher`, async ({ page }) => {
    const failedFonts: string[] = []
    page.on("response", (r) => {
      if (/\.woff2/.test(r.url()) && r.status() >= 400) failedFonts.push(r.url())
    })
    await page.goto(lang === "en" ? "/" : `/${lang}`)
    await page.evaluate(() => document.fonts.ready)
    expect(await page.locator("h1").evaluate((e) => getComputedStyle(e).fontFamily)).toContain("Unbounded")
    expect(
      await page
        .locator(".assistant-message p")
        .first()
        .evaluate((e) => getComputedStyle(e).fontFamily),
    ).toContain("Onest")
    expect(
      await page
        .locator(".assistant-message p")
        .first()
        .evaluate((e) => getComputedStyle(e).fontSize),
    ).toBe("14px")
    expect(await page.locator(".outcomes5-simple").evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(
      "rgb(255, 255, 255)",
    )
    await expect(page.locator("[data-font-switcher],.font-switcher")).toHaveCount(0)
    expect(failedFonts).toEqual([])
  })
}
