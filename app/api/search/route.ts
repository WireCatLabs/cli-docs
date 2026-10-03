import { createFromSource } from "fumadocs-core/search/server"
import { searchIntentPhrases } from "@/lib/search-intents"
import { source } from "@/lib/source"

export const revalidate = false

export const { staticGET: GET } = createFromSource(source, {
  localeMap: { en: "english", ru: "russian", es: "spanish" },
  buildIndex: (page) => {
    const structuredData = page.data.structuredData
    if (!structuredData) throw new Error(`Missing search content: ${page.url}`)
    return {
      id: page.url,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      structuredData: {
        ...structuredData,
        contents: [
          ...structuredData.contents,
          ...searchIntentPhrases(page.slugs, page.locale).map((content) => ({ heading: undefined, content })),
        ],
      },
    }
  },
})
