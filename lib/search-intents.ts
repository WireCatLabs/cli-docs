import intents from "./search-intents.json"

/** Reviewed alternative phrases enrich search, without adding keyword lists to the visible docs. */
export function searchIntentPhrases(slugs: string[], language = "en") {
  return intents
    .filter((intent) => intent.pages.includes(slugs.join("/")))
    .map((intent) =>
      (intent.phrases[language as keyof typeof intent.phrases] ?? intent.phrases.en).replaceAll("{tool}", slugs[0]),
    )
}

export function preferredSearchTool(query: string, pathname: string) {
  const mentioned = new Set(
    query
      .toLowerCase()
      .match(/\b(tg|telegram|max)\b/g)
      ?.map((tool) => (tool === "telegram" ? "tg" : tool)),
  )
  if (mentioned.size > 1) return undefined
  return [...mentioned][0] ?? /\/docs\/(tg|max)(?:\/|$)/.exec(pathname)?.[1]
}
