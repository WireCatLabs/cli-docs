import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { CSSProperties } from "react"
import { DocsHeader } from "@/components/docs-header"
import { DocsSidebarItem } from "@/components/docs-sidebar-item"
import { DocsSidebarTitle } from "@/components/docs-sidebar-title"
import { GettingStartedLinks } from "@/components/getting-started-links"
import { baseOptions } from "@/lib/layout.shared"
import { source } from "@/lib/source"

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}) {
  const { lang } = await params
  const options = baseOptions(lang)
  return (
    <DocsLayout
      {...options}
      tree={source.getPageTree(lang)}
      tabs={false}
      slots={{ header: DocsHeader, navTitle: DocsSidebarTitle }}
      sidebar={{
        banner: (
          <>
            <DocsSidebarTitle className="mb-3 block px-2 font-semibold md:hidden" />
            <GettingStartedLinks lang={lang} />
          </>
        ),
        components: { Item: DocsSidebarItem },
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
  )
}
