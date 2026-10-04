import { i18nProvider } from "fumadocs-ui/i18n"
import { RootProvider } from "fumadocs-ui/provider/next"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import SearchDialog from "@/components/search"
import { SiteAnalytics } from "@/components/site-analytics"
import { i18n } from "@/lib/i18n"
import { translations } from "@/lib/layout.shared"
import { appName, siteDescription, siteUrl, tagline } from "@/lib/shared"
import "../global.css"

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-docs" })

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: React.ReactNode
}) {
  const { lang } = await params
  return (
    <html lang={lang} className={`${inter.className} ${inter.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <SiteAnalytics />
        <RootProvider i18n={i18nProvider(translations, lang)} search={{ SearchDialog }}>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
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
  title: { template: `%s · ${appName}`, default: `${appName} · ${tagline}` },
  description: siteDescription,
  applicationName: appName,
  openGraph: { siteName: appName, type: "website", title: `${appName} · ${tagline}`, description: siteDescription },
  twitter: { card: "summary", title: `${appName} · ${tagline}`, description: siteDescription },
}
