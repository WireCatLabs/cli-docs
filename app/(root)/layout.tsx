import type { Metadata } from "next"
import { SiteAnalytics } from "@/components/site-analytics"
import { pageMetadata, seoWords } from "@/lib/seo"
import { siteUrl } from "@/lib/shared"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({ lang: "en", title: seoWords("en").homeTitle, description: seoWords("en").homeDescription }),
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }], apple: "/apple-touch-icon.png" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteAnalytics />
        {children}
      </body>
    </html>
  )
}
