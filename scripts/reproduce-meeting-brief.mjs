import { createDemoDates } from "../lib/search-playground/dates.ts"
import { createDemoMessages, locator, searchDemo } from "../lib/search-playground/engine.ts"

// The published brief is reproducible; the interactive playground moves with today's date.
const dates = createDemoDates(new Date("2026-10-05T12:00:00Z"))
dates.deadline = "2026-10-09"
const texts = {
  10: "Atlas invoice: can we aim for Tuesday?",
  11: "Tuesday is too early. The client needs time to review.",
  12: "Atlas invoice deadline confirmed: Friday, October 9.",
}
const archive = createDemoMessages(dates)
  .filter((message) => Number(message.id) < 74)
  .map((message) => ({ ...message, text: texts[message.id] ?? message.text }))

const query = 'chat:"Atlas project" AND ("deadline confirmed" OR "final invoice")'
const hits = searchDemo(query, archive)
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
