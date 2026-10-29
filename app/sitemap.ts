import type { MetadataRoute } from "next"
import { blogPath, blogPostLocales, blogPosts, blogTagLocales, blogTagsIn } from "@/lib/blog"
import { absoluteUrl, pageAlternates, seoLocales } from "@/lib/seo"
import { homePath } from "@/lib/site-routes"
import { source } from "@/lib/source"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return seoLocales.flatMap((lang) => [
    ...["", "/about", "/download", "/features", "/examples", "/privacy", "/terms", "/blog"].map((suffix) => ({
      url: absoluteUrl(suffix ? `/${lang}${suffix}` : homePath(lang)),
      alternates: { languages: pageAlternates(lang, suffix).languages },
    })),
    ...source.getPages(lang).map((page) => {
      const available = seoLocales.filter((locale) => source.getPage(page.slugs, locale))
      return {
        url: absoluteUrl(page.url),
        alternates: {
          languages: pageAlternates(lang, `/docs${page.slugs.length ? `/${page.slugs.join("/")}` : ""}`, available)
            .languages,
        },
      }
    }),
    ...blogPosts(lang)
      .filter((post) => !post.canonical)
      .map((post) => ({
        url: absoluteUrl(post.url),
        lastModified: post.updated ?? post.date,
        alternates: { languages: pageAlternates(lang, `/blog/${post.slug}`, blogPostLocales(post.slug)).languages },
      })),
    ...blogTagsIn(lang).map((tag) => ({
      url: absoluteUrl(blogPath(lang, "tags", tag.id)),
      alternates: { languages: pageAlternates(lang, `/blog/tags/${tag.id}`, blogTagLocales(tag.id)).languages },
    })),
  ])
}
