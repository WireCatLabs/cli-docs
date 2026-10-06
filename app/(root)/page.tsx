import { Landing } from "@/components/landing"
import { StructuredData } from "@/components/structured-data"
import en from "@/lib/landing/en.json"
import { pageStructuredData, seoWords } from "@/lib/seo"

export default function Root() {
  const words = seoWords("en")
  return (
    <>
      <StructuredData
        data={pageStructuredData({
          lang: "en",
          pathname: "/",
          title: words.homeTitle,
          description: words.homeDescription,
        })}
      />
      <Landing {...en} lang="en" />
    </>
  )
}
