import type { Metadata } from "next"
import LandingLayout from "@/app/[lang]/(home)/layout"
import LocaleLayout, { generateMetadata as localeMetadata } from "@/app/[lang]/layout"

const params = Promise.resolve({ lang: "en" })

export async function generateMetadata(): Promise<Metadata> {
  return localeMetadata({ params })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleLayout params={params}>
      <LandingLayout params={params}>{children}</LandingLayout>
    </LocaleLayout>
  )
}
