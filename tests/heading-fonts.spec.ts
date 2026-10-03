import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import fonts from "../lib/landing/heading-fonts.json" with { type: "json" }

const typography = (element: Element) => {
  const style = getComputedStyle(element)
  return [style.fontFamily, style.fontWeight, style.fontStretch]
}

test("search uses the same heading face; font comparison stays opt-in", async ({ page }) => {
  const fontRequests: string[] = []
  page.on("request", (request) => {
    if (request.url().includes("/heading-lab/")) fontRequests.push(request.url())
  })
  for (const lang of ["en", "ru", "es"]) {
    await page.goto(`/${lang}`)
    await page.locator(".sp-input:not([readonly])").waitFor()
    expect(await page.locator(".sp-heading h2").evaluate(typography)).toEqual(
      await page.locator("h2.big").first().evaluate(typography),
    )
    await expect(page.locator(".font-lab")).toHaveCount(0)
  }
  expect(fontRequests).toEqual([])
})

test("all eight Cyrillic fonts load locally and update hero, section and search headings together", async ({
  page,
}) => {
  test.setTimeout(60000)
  const failures: string[] = []
  page.on("requestfailed", (request) => failures.push(request.url()))
  page.on("request", (request) => {
    if (/fonts\.(?:googleapis|gstatic)\.com/u.test(request.url())) failures.push(request.url())
  })
  await page.goto("/en?fonts=1&scenario=commitments&messenger=max#search-playground")
  const picker = page.getByRole("combobox", { name: "Heading fonts", exact: true })
  await expect(picker.locator("option")).toHaveCount(8)
  const body = await page.locator(".lede").evaluate(typography)
  for (const font of fonts) {
    await picker.selectOption(font.id)
    await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", font.id)
    const hero = await page.locator("h1").evaluate(typography)
    expect(hero[0]).toContain(font.family)
    expect(hero[1]).toBe(String(font.weight))
    expect(await page.locator("h2.big").first().evaluate(typography)).toEqual(hero)
    expect(await page.locator(".sp-heading h2").evaluate(typography)).toEqual(hero)
    expect(await page.locator(".lede").evaluate(typography)).toEqual(body)
    await expect(page).toHaveURL(/scenario=commitments/u)
    await expect(page).toHaveURL(/messenger=max/u)
  }
  await page.getByRole("button", { name: "Next font", exact: true }).click()
  await expect(picker).toHaveValue("robotocondensed")
  await page.getByRole("button", { name: "Previous font", exact: true }).click()
  await expect(picker).toHaveValue("unbounded")
  await page.getByRole("button", { name: "Reset font", exact: true }).click()
  await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", "firasansextracondensed")
  const results = await new AxeBuilder({ page }).include(".font-lab").withTags(["wcag2a", "wcag2aa"]).analyze()
  expect(results.violations).toEqual([])
  expect(failures).toEqual([])
})

test("Russian rotation uses fonts with Cyrillic; a choice survives reload and fits mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/ru?fonts=1")
  const picker = page.getByRole("combobox", { name: "Шрифты заголовков", exact: true })
  for (const font of fonts) {
    expect(font.cyrillic).toBe(true)
    await expect(picker.locator(`option[value="${font.id}"]`)).toBeEnabled()
    await picker.selectOption(font.id)
    await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", font.id)
  }
  await page.getByRole("button", { name: "Сбросить шрифт", exact: true }).click()
  await page.getByRole("button", { name: "Следующий шрифт", exact: true }).click()
  await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", "sofiasanscondensed")
  await picker.selectOption("manrope")
  await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", "manrope")
  await page.reload()
  await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", "manrope")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(await page.locator(".sp-heading h2").evaluate(typography)).toEqual(
    await page.locator("h1").evaluate(typography),
  )
})

test("wide display fonts keep the final word and punctuation together on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto("/en?fonts=1&font=unbounded#search-playground")
  await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", "unbounded")
  const positions = await page.locator(".sp-heading h2").evaluate((element) => {
    const node = element.firstChild
    if (!node?.textContent) throw new Error("Missing heading text")
    const length = node.textContent.length
    return [length - 2, length - 1].map((at) => {
      const range = document.createRange()
      range.setStart(node, at)
      range.setEnd(node, at + 1)
      return range.getBoundingClientRect().top
    })
  })
  expect(positions[0]).toBe(positions[1])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test("removed Latin-only choices fall back to Fira and update the shared URL", async ({ page }) => {
  await page.goto("/en?fonts=1&font=archivo&scenario=commitments#search-playground")
  await expect(page.locator(".wirecat-landing")).toHaveAttribute("data-heading-font", "firasansextracondensed")
  await expect(page).toHaveURL(/font=firasansextracondensed/u)
  await expect(page).toHaveURL(/scenario=commitments/u)
  const picker = page.getByRole("combobox", { name: "Heading fonts", exact: true })
  await expect(picker.locator("option")).toHaveCount(8)
  await expect(picker.locator('option[value="archivo"]')).toHaveCount(0)
})
