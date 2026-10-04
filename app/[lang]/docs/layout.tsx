import "../../docs.css"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { CSSProperties } from "react"
import { preload } from "react-dom"
import { documentationFonts } from "@/lib/docs-fonts"
import "@/lib/docs-fonts.css"
import { DocsHeader } from "@/components/docs-header"
import { DocsProvider } from "@/components/docs-provider"
import { DocsSidebarFolder } from "@/components/docs-sidebar-folder"
import { DocsSidebarItem } from "@/components/docs-sidebar-item"
import { DocsSidebarTitle } from "@/components/docs-sidebar-title"
import { GettingStartedLinks } from "@/components/getting-started-links"
import { SiteFooter } from "@/components/site-footer"
import { unifiedDocsTree } from "@/lib/docs-sidebar-tree"
import en from "@/lib/landing/en.json"
import es from "@/lib/landing/es.json"
import ru from "@/lib/landing/ru.json"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"
import "@/lib/landing/fonts.css"
import "@/lib/landing/landing.css"
import "@/lib/landing/theme.css"
import "@/lib/landing/footer.css"
import "@/lib/landing/docs-footer.css"

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}) {
  const { lang } = await params
  for (const font of documentationFonts(lang))
    preload(font, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  const options = baseOptions(lang)
  const content = { en, es, ru }[lang as "en" | "es" | "ru"] ?? en
  return (
    <DocsProvider lang={lang}>
      <DocsLayout
        {...options}
        tree={unifiedDocsTree(source.getPageTree(lang))}
        tabs={false}
        slots={{ header: DocsHeader, navTitle: DocsSidebarTitle }}
        sidebar={{
          banner: (
            <>
              <DocsSidebarTitle className="mb-3 block px-2 font-semibold md:hidden" />
              <GettingStartedLinks lang={lang} />
            </>
          ),
          components: { Item: DocsSidebarItem, Folder: DocsSidebarFolder },
        }}
        containerProps={{
          className: "wirecat-docs",
          style: {
            "--fd-header-height": "3.5rem",
            gridTemplate: "var(--wirecat-docs-grid)",
          } as CSSProperties,
        }}
      >
        {children}
      </DocsLayout>
      <div className="wirecat-landing wirecat-docs-footer">
        <SiteFooter html={content.footerHtml} variant="docs" />
      </div>
    </DocsProvider>
  )
}
