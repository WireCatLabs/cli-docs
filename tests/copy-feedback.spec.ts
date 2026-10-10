import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: header, page and footer copy buttons share one toast`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto(lang === "en" ? "/" : `/${lang}`)
    const toast = page.locator("[data-copy-feedback]")
    await page.locator("header [data-connect] > summary").click()
    const headerCopy = page.locator("header .copy-agent")
    const bodyCopy = page.locator(".setup [data-copy]").first()
    const footerCopy = page.locator("footer [data-copy]")
    for (const button of [headerCopy, bodyCopy, footerCopy]) {
      if (button === bodyCopy) await page.locator(".setup [data-connect] > summary").click()
      await button.click()
      await expect(toast).toBeVisible()
      await expect(toast).toContainText({ en: "Copied", ru: "Скопировано", es: "Copiado" }[lang])
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(await button.getAttribute("data-copy"))
      expect(await toast.evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight)).toBe(true)
    }
    await expect(toast).toBeHidden({ timeout: 4500 })
    await page.goto(`/${lang}/about`)
    await page.locator("footer [data-copy]").click()
    await expect(toast).toBeVisible()
  })
}

test("failed clipboard writes show an error instead of a success toast", async ({ page }) => {
  await page.goto("/ru")
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: async () => {
        throw new Error("Clipboard denied")
      },
    })
  })
  await page.locator("footer [data-copy]").click()
  await expect(page.locator("[data-copy-feedback]")).toContainText("Не удалось скопировать")
  await expect(page.locator("footer [data-copy]")).not.toHaveAttribute("data-copied", "")
})
