import type { Metadata } from "next"
import { appName, siteDescription, siteUrl, tagline } from "@/lib/shared"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${appName} · ${tagline}`,
  description: siteDescription,
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }], apple: "/apple-touch-icon.png" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
