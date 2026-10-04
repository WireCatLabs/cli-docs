import type { Metadata } from "next"
import { SiteAnalytics } from "@/components/site-analytics"
import { i18n } from "@/lib/i18n"
import { pageMetadata, seoWords } from "@/lib/seo"
import { appName, siteUrl } from "@/lib/shared"
import "../global.css"

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}) {
  const { lang } = await params
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <SiteAnalytics />
        {children}
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const words = seoWords(lang)
  return {
    ...pageMetadata({ lang, title: words.homeTitle, description: words.homeDescription }),
    metadataBase: new URL(siteUrl),
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    applicationName: appName,
  }
}
