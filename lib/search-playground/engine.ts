import {
  compileAutomaton,
  dateRange,
  normalize,
  parseLucene,
  QUERY_FIELDS,
  type QueryNode,
  validateFields,
  wildcardPattern,
} from "../search-language.generated.js"

export type DemoMessage = {
  id: string
  provider: "telegram" | "max"
  chat: string
  chatId: string
  from: string
  date: string
  text: string
  kind: "group" | "private"
  has: string[]
}
const row = (
  id: string,
  provider: DemoMessage["provider"],
  chat: string,
  chatId: string,
  from: string,
  hour: string,
  text: string,
  has: string[] = [],
): DemoMessage => ({
  id,
  provider,
  chat,
  chatId,
  from,
  date: `2026-10-03T${hour}:00Z`,
  text,
  has,
  kind: provider === "max" ? "private" : "group",
})
export const messages: DemoMessage[] = [
  row("10", "telegram", "Atlas project", "301", "Alice", "09:00", "Atlas invoice: can we aim for Tuesday?"),
  row(
    "11",
    "telegram",
    "Atlas project",
    "301",
    "Sam",
    "09:04",
    "Tuesday is too early. The client needs time to review.",
  ),
  row(
    "12",
    "telegram",
    "Atlas project",
    "301",
    "Alice",
    "09:08",
    "Atlas invoice deadline confirmed: Friday, October 9.",
  ),
  row(
    "13",
    "telegram",
    "Atlas project",
    "301",
    "Sam",
    "09:10",
    "Agreed. I will send the final invoice after the review.",
    ["file"],
  ),
  row("20", "max", "Client studio", "401", "Mia", "10:00", "Atlas budget: does the estimate include the extra work?"),
  row(
    "21",
    "max",
    "Client studio",
    "401",
    "Sam",
    "10:03",
    "The original scope is covered. The extra work is a separate estimate.",
  ),
  row(
    "22",
    "max",
    "Client studio",
    "401",
    "Mia",
    "10:06",
    "Atlas budget: extra work is not approved. We need the final quote.",
  ),
  row("23", "max", "Client studio", "401", "Sam", "10:09", "I will send a revised estimate tomorrow.", ["file"]),
  row(
    "30",
    "telegram",
    "Finance team",
    "302",
    "Sam",
    "11:00",
    "Atlas invoice draft is attached. The agreed deadline is Friday.",
    ["file"],
  ),
  row(
    "31",
    "telegram",
    "Finance team",
    "302",
    "Alice",
    "11:05",
    "Please keep the extra work out until it is approved.",
  ),
  row("40", "telegram", "Weekend plans", "303", "Mia", "12:00", "Anyone up for coffee on Friday?"),
  row("41", "telegram", "Weekend plans", "303", "Sam", "12:03", "Yes! See you there."),
]
export const initialQuery = "Atlas AND (invoice OR budget)"
export const demoFields = QUERY_FIELDS.filter(
  (field) => field.support === "A1" && !["preset", "topic"].includes(field.name),
)
export const locator = (message: DemoMessage) => `msg:${message.provider}/demo/${message.chatId}/${message.id}`
const tokens = (text: string) => normalize(text).match(/[\p{L}\p{N}]+/gu) ?? []
const inRange = (time: number, range: ReturnType<typeof dateRange>) =>
  (range.lower === undefined || (range.lowerInclusive ? time >= range.lower : time > range.lower)) &&
  (range.upper === undefined || (range.upperInclusive ? time <= range.upper : time < range.upper))
export const compileQuery = (query: string): ((message: DemoMessage) => boolean) => {
  const ast = validateFields(parseLucene(query))
  const compile = (node: QueryNode): ((message: DemoMessage) => boolean) => {
    if (node.kind === "boolean") {
      const clauses = node.clauses.map((clause) => ({ occur: clause.occur, test: compile(clause.node) }))
      const must = clauses.filter((clause) => clause.occur === "must")
      const should = clauses.filter((clause) => clause.occur === "should")
      const excluded = clauses.filter((clause) => clause.occur === "mustNot")
      return (message) =>
        (must.length > 0 || should.length > 0) &&
        must.every((clause) => clause.test(message)) &&
        !excluded.some((clause) => clause.test(message)) &&
        (must.length > 0 || should.some((clause) => clause.test(message)))
    }
    if (!demoFields.some((field) => field.name === node.field))
      throw new Error(
        `This demo supports ${demoFields.map((field) => field.name).join(", ")}. Copy other valid queries to the CLI.`,
      )
    if (node.field === "date") {
      const range = dateRange(
        node.value,
        node.upper ?? node.value,
        node.lowerInclusive ?? true,
        node.upperInclusive ?? true,
        "UTC",
        node.span,
      )
      return (message) => inRange(Date.parse(message.date), range)
    }
    if (node.field === "text") {
      if (["regex", "wildcard"].includes(node.operator)) {
        const pattern = compileAutomaton(
          node.operator === "regex" ? node.value : wildcardPattern(normalize(node.value)),
        )
        return (message) => tokens(message.text).some((term) => pattern.test(term))
      }
      const wanted = tokens(node.value)
      return (message) =>
        wanted.length > 0 &&
        tokens(message.text).some((_, index, terms) => wanted.every((term, at) => terms[index + at] === term))
    }
    if (node.field === "body") {
      if (["regex", "wildcard"].includes(node.operator)) {
        const pattern = compileAutomaton(node.operator === "regex" ? node.value : wildcardPattern(node.value))
        return (message) => pattern.test(message.text)
      }
      return (message) => message.text === node.value
    }
    if (node.field === "chat" || node.field === "from") {
      const matching = [
        ...new Set(messages.map((message) => (node.field === "chat" ? message.chat : message.from))),
      ].filter((value) => normalize(value).includes(normalize(node.value)))
      const chatId = messages.find((message) => message.chatId === node.value)?.chat
      if (node.field === "chat" && chatId) return (message) => message.chatId === node.value
      if (matching.length !== 1)
        throw new Error(
          matching.length
            ? "Choose one unambiguous chat or person from suggestions."
            : "No such chat or person in this sample archive.",
        )
      return (message) => message[node.field as "chat" | "from"] === matching[0]
    }
    if (node.field === "has")
      return (message) =>
        node.value.toLowerCase() === "attachment"
          ? message.has.length > 0
          : message.has.includes(node.value.toLowerCase())
    if (node.field === "kind") return (message) => message.kind === node.value.toLowerCase()
    if (node.field === "in")
      return (message) => ["all", "personal", message.provider].includes(node.value.toLowerCase())
    throw new Error("This field is not available in this demo.")
  }
  return compile(ast.root)
}
export type Hit = { message: DemoMessage; context: DemoMessage[] }
export const searchDemo = (query: string): Hit[] => {
  if (!query.trim()) return []
  const test = compileQuery(query)
  return messages
    .filter(test)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((message) => {
      const chat = messages.filter((row) => row.chatId === message.chatId && row.provider === message.provider)
      const index = chat.findIndex((row) => row.id === message.id)
      return { message, context: chat.slice(Math.max(0, index - 2), index + 3) }
    })
}
export type Suggestion = { label: string; detail: string; value: string; cursor: number }
export const suggestionsFor = (query: string, cursor: number): Suggestion[] => {
  const left = query.slice(0, cursor)
  const match = left.match(/(?:^|[\s(])([a-z]+:)?("[^"\n]*|[^\s():]*)$/iu)
  if (!match) return []
  const field = match[1]?.slice(0, -1)
  const fragment = match[2].replace(/^"/u, "")
  const from = cursor - match[2].length
  let candidates: { label: string; insert: string; detail: string }[]
  if (field === "chat" || field === "from")
    candidates = [...new Set(messages.map((row) => row[field]))].map((label) => ({
      label,
      insert: JSON.stringify(label),
      detail: field,
    }))
  else if (field === "date")
    candidates = [{ label: "October 2026", insert: "[2026-10-01 TO 2026-10-31]", detail: "UTC" }]
  else if (field)
    candidates = (demoFields.find((row) => row.name === field)?.values ?? []).map((label) => ({
      label,
      insert: label,
      detail: field,
    }))
  else
    candidates = [
      ...demoFields.map((row) => ({ label: `${row.name}:`, insert: `${row.name}:`, detail: row.type })),
      ...["AND", "OR", "NOT"].map((label) => ({ label, insert: `${label} `, detail: "operator" })),
    ]
  const right = query.slice(cursor)
  const quoteEnd = right.indexOf('"')
  const end = match[2].startsWith('"') ? (quoteEnd < 0 ? 0 : quoteEnd + 1) : (right.match(/^[^\s)]*/u)?.[0].length ?? 0)
  return candidates
    .filter((row) => normalize(row.label).includes(normalize(fragment)))
    .slice(0, 10)
    .map((row) => ({
      label: row.label,
      detail: row.detail,
      value: query.slice(0, from) + row.insert + query.slice(cursor + end),
      cursor: from + row.insert.length,
    }))
}
export const queryErrorDetails = (error: unknown) => {
  const failure = error as { message?: string; details?: { reason?: string; span?: { start: number; end: number } } }
  return { message: failure.message ?? "Invalid query", span: failure.details?.span, reason: failure.details?.reason }
}

export const highlightWords = (query: string): Set<string> => {
  try {
    const root = parseLucene(query).root
    const values: string[] = []
    const visit = (node: QueryNode) => {
      if (node.kind === "boolean") {
        for (const clause of node.clauses) if (clause.occur !== "mustNot") visit(clause.node)
      } else if (node.field === "text" && ["term", "phrase"].includes(node.operator)) values.push(...tokens(node.value))
    }
    visit(root)
    return new Set(values)
  } catch {
    return new Set()
  }
}
