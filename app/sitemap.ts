import type { MetadataRoute } from "next"
import { absoluteUrl, pageAlternates, seoLocales } from "@/lib/seo"
import { homePath } from "@/lib/site-routes"
import { source } from "@/lib/source"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return seoLocales.flatMap((lang) => [
    ...["", "/about", "/features", "/examples"].map((suffix) => ({
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
  ])
}
