import { Editorial } from "@/components/landing/editorial"
import { StructuredData } from "@/components/structured-data"
import en from "@/lib/editorial/en.json"
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
      <Editorial html={en.home} lang="en" />
    </>
  )
}
