import { locator, searchDemo } from "../lib/search-playground/engine.ts"

const query = 'chat:"Atlas project" AND ("deadline confirmed" OR "final invoice")'
const hits = searchDemo(query)
const context = [...new Map(hits.flatMap((hit) => hit.context).map((message) => [locator(message), message])).values()]
console.log(
  JSON.stringify(
    {
      dataset: "WireCat synthetic search-playground fixture",
      query,
      matches: hits.map(({ message }) => ({ source: locator(message), text: message.text })),
      context: context.map((message) => ({ source: locator(message), text: message.text })),
    },
    null,
    2,
  ),
)
