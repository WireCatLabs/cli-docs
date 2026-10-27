import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { blogFrontmatters } from "../scripts/blog-tags.ts"

// Production exports leave drafts out; the dev server and BLOG_DRAFTS=1 builds show them.
const exported = process.env.PLAYWRIGHT_EXPORT === "1" && process.env.BLOG_DRAFTS !== "1"
const posts = blogFrontmatters()
  .filter((post) => post.value && (!exported || !post.value.draft))
  .map((post) => {
    const [slug, name] = post.file.split(/[\\/]/)
    return { slug, lang: /index\.(ru|es)\./.exec(name ?? "")?.[1] ?? "en", tags: post.value?.tags ?? [] }
  })

for (const lang of ["en", "ru", "es"]) {
  test(`blog ${lang}: list, feed and Markdown index`, async ({ page, request }) => {
    const response = await page.goto(`/${lang}/blog`)
    expect(response?.status()).toBe(200)
    await expect(page.locator("main h1")).toHaveCount(1)
    const listed = posts.filter((post) => post.lang === lang)
    await expect(page.locator(".blog-list > li")).toHaveCount(listed.length)
    if (!listed.length) await expect(page.locator(".blog-empty")).toBeVisible()

    const feed = await request.get(`/${lang}/blog/rss.xml`)
    expect(feed.ok()).toBe(true)
    const xml = await feed.text()
    expect(xml).toContain(`<link>https://wirecat.dev/${lang}/blog</link>`)
    for (const draft of blogFrontmatters().filter((entry) => entry.value?.draft))
      expect(xml).not.toContain(`/blog/${draft.file.split(/[\\/]/)[0]}<`)
    const index = await request.get(`/llms.mdx/blog/${lang}/content.md`)
    expect(index.ok()).toBe(true)
    expect(await index.text()).toMatch(/^# WireCat /)
  })
}

for (const post of posts) {
  test(`blog post ${post.lang}/${post.slug}: reads, links and reaches agents`, async ({ page, request }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    const response = await page.goto(`/${post.lang}/blog/${post.slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator("main h1")).toHaveCount(1)
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0)
    }
    for (const tag of post.tags)
      await expect(page.locator(`.blog-post-head .blog-tags a[href="/${post.lang}/blog/tags/${tag}"]`)).toBeVisible()

    const languages = posts.filter((other) => other.slug === post.slug).map((other) => other.lang)
    for (const lang of ["en", "ru", "es"]) {
      const href = await page.locator(`.site-header .language-options a[lang="${lang}"]`).getAttribute("href")
      expect(href).toBe(languages.includes(lang) ? `/${lang}/blog/${post.slug}` : `/${lang}/blog`)
    }

    const markdown = await request.get(`/llms.mdx/blog/${post.lang}/${post.slug}/content.md`)
    expect(markdown.ok()).toBe(true)
    const text = await markdown.text()
    expect(text).toMatch(new RegExp(`^# .+ \\(https://wirecat\\.dev/${post.lang}/blog/${post.slug}\\)`))
    expect(text).not.toMatch(/\[#[\w-]+\]$/m)
    const image = await request.get(`/og/blog-${post.lang}-${post.slug}.png`)
    expect(image.headers()["content-type"]).toBe("image/png")
    for (const tag of post.tags) expect((await request.get(`/${post.lang}/blog/tags/${tag}`)).ok()).toBe(true)

    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const scan = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(scan.violations).toEqual([])
    expect(errors).toEqual([])
  })
}
