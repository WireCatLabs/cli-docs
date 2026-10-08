import { expect, test } from "@playwright/test"

for (const lang of ["en", "ru", "es"])
  for (const tool of ["tg", "max"]) {
    test(`${lang}/${tool}: reference entry is small and legacy anchors reach the right partition`, async ({
      page,
      request,
    }) => {
      await page.goto(`/${lang}/docs/${tool}/commands`)
      await expect(page.locator("[data-command-index]")).toBeVisible()
      await expect(page.locator("main pre")).toHaveCount(0)
      expect(await page.evaluate(() => document.querySelectorAll("*").length)).toBeLessThan(2500)
      for (const group of ["personal", "bot", "admin"])
        await expect(
          page.locator(`[data-command-index] a[href="/${lang}/docs/${tool}/commands-${group}"]`),
        ).toHaveCount(1)
      await page.goto(`/${lang}/docs/${tool}/commands#${tool}-chats-members-add`)
      await expect(page).toHaveURL(new RegExp(`commands-admin#${tool}-chats-members-add$`))
      await expect(page.locator(`#${tool}-chats-members-add`)).toBeInViewport()
      await page.goto(`/${lang}/docs/${tool}/commands#${tool}-bot-api`)
      await expect(page).toHaveURL(new RegExp(`commands-bot#${tool}-bot-api$`))
      await expect(page.locator(`#${tool}-bot-api`)).toBeInViewport()
      const locale = lang === "en" ? "" : `${lang}/`
      const md = await request.get(`/llms.mdx/docs/${locale}${tool}/commands/content.md`)
      expect(md.ok()).toBe(true)
      expect(await md.text()).toContain(`${tool} messages search`)
    })
  }
