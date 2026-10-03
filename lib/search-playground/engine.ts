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
  day = "2026-10-03",
): DemoMessage => ({
  id,
  provider,
  chat,
  chatId,
  from,
  date: `${day}T${hour}:00Z`,
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
    "Leo",
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
  row("23", "max", "Client studio", "401", "Leo", "10:09", "I will send a revised estimate tomorrow.", ["file"]),
  row(
    "30",
    "telegram",
    "Finance team",
    "302",
    "Sam",
    "11:00",
    "Atlas invoice draft is attached. The agreed deadline is Friday.",
    ["file"],
    "2026-10-04",
  ),
  row(
    "31",
    "telegram",
    "Finance team",
    "302",
    "Alice",
    "11:05",
    "Please keep the extra work out until it is approved.",
    [],
    "2026-10-04",
  ),
  row("40", "telegram", "Weekend plans", "303", "Noah", "12:00", "Anyone up for coffee on Friday?", [], "2026-10-05"),
  row("41", "telegram", "Weekend plans", "303", "Noah", "12:03", "Yes! See you there.", [], "2026-10-05"),
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
  const test = query.trim() ? compileQuery(query) : () => true
  return messages
    .filter(test)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((message) => {
      const chat = messages.filter((row) => row.chatId === message.chatId && row.provider === message.provider)
      const index = chat.findIndex((row) => row.id === message.id)
      return { message, context: chat.slice(Math.max(0, index - 2), index + 3) }
    })
}
export type Clause = { field: string; start: number; end: number; value: string }
const quotedEnd = (query: string, from: number, delimiter: string): number => {
  for (let at = from + 1; at < query.length; at++) {
    if (query[at] === "\\") {
      at++
      continue
    }
    if (query[at] === delimiter) return at + 1
  }
  return query.length
}
export const filterClauses = (query: string): Clause[] => {
  const clauses: Clause[] = []
  for (let at = 0; at < query.length; ) {
    if (query[at] === '"' || query[at] === "/") {
      at = quotedEnd(query, at, query[at])
      continue
    }
    const prefix =
      at === 0 || /[\s(]/u.test(query[at - 1]) ? query.slice(at).match(/^([a-z][a-z-]*)\s*(:|=|>=?|<=?)\s*/iu) : null
    if (!prefix) {
      at++
      continue
    }
    const start = at
    const valueStart = at + prefix[0].length
    at = valueStart
    if (query[at] === '"' || query[at] === "/") at = quotedEnd(query, at, query[at])
    else if (query[at] === "[" || query[at] === "{") {
      at++
      while (at < query.length && !/[\]}]/u.test(query[at])) {
        if (query[at] === '"') at = quotedEnd(query, at, '"')
        else at++
      }
      if (at < query.length) at++
    } else if (query[at] === "(") {
      let depth = 1
      at++
      while (at < query.length && depth > 0) {
        if (query[at] === '"' || query[at] === "/") at = quotedEnd(query, at, query[at])
        else {
          if (query[at] === "(") depth++
          if (query[at] === ")") depth--
          at++
        }
      }
    } else {
      while (at < query.length && !/[\s)]/u.test(query[at])) {
        if (query[at] === "\\") at++
        at++
      }
    }
    clauses.push({ field: prefix[1].toLowerCase(), start, end: at, value: query.slice(valueStart, at) })
  }
  return clauses
}
export const replaceFilter = (query: string, field: string, value?: string): string => {
  const clauses = filterClauses(query).filter((clause) => clause.field === field)
  if (!clauses.length)
    return value === undefined ? query : [query.trim(), `${field}:${value}`].filter(Boolean).join(" ")
  if (value !== undefined) {
    const first = clauses[0]
    return `${query.slice(0, first.start)}${field}:${value}${query.slice(first.end)}`
  }
  let result = query
  for (const clause of clauses.reverse()) {
    let start = clause.start,
      end = clause.end
    const before = result.slice(0, start).match(/(?:^|\s)(?:AND|OR)\s*$/u)
    const after = result.slice(end).match(/^\s*(?:AND|OR)\b\s*/u)
    if (before) start -= before[0].length
    else if (after) end += after[0].length
    result = result.slice(0, start) + result.slice(end)
  }
  for (let at = 0; at < result.length; ) {
    if (result[at] === '"' || result[at] === "/") {
      at = quotedEnd(result, at, result[at])
      continue
    }
    const empty = result.slice(at).match(/^\(\s*\)/u)
    if (empty) result = result.slice(0, at) + result.slice(at + empty[0].length)
    else at++
  }
  return result
    .replace(/(?:^|\s)(?:AND|OR)\s*$/u, "")
    .replace(/^(?:AND|OR)\s+/u, "")
    .trim()
}
export type Suggestion = { label: string; detail: string; value: string; cursor: number; labelKey?: string }
const dates = [
  { key: "sampleDay", label: "Sample day · October 3", insert: "2026-10-03" },
  { key: "sampleMonth", label: "October 2026", insert: "[2026-10-01 TO 2026-10-31]" },
  { key: "fromSampleDay", label: "October 3 onward", insert: "[2026-10-03 TO *]" },
  { key: "beforeNextDay", label: "Before October 4", insert: "{* TO 2026-10-04}" },
  { key: "sampleWeek", label: "October 3–9", insert: "[2026-10-03 TO 2026-10-09]" },
]
export const suggestionsFor = (query: string, cursor: number): Suggestion[] => {
  const clause = filterClauses(query).find((row) => cursor > row.start && cursor <= row.end)
  const left = query.slice(0, cursor)
  const fragmentMatch = left.match(/(?:^|[\s(])([a-z]+:)?("[^"\n]*|[^\s():]*)$/iu)
  const field = clause?.field ?? fragmentMatch?.[1]?.slice(0, -1)
  if (!fragmentMatch && field !== "date")
    return left.endsWith(")") ? suggestionsFor(`${query.slice(0, cursor)} ${query.slice(cursor)}`, cursor + 1) : []
  const fragment = field === "date" && clause ? clause.value : (fragmentMatch?.[2] ?? "").replace(/^"/u, "")
  const from = field === "date" && clause ? clause.start : cursor - (fragmentMatch?.[2].length ?? 0)
  let candidates: { label: string; insert: string; detail: string; labelKey?: string }[]
  const words = [...new Set(messages.flatMap((row) => tokens(row.text)))].filter((word) => word.length > 2)
  const textValues = ["Atlas", "invoice", "budget", "deadline", "estimate", "coffee", "approved", ...words].filter(
    (word, index, all) => all.findIndex((value) => normalize(value) === normalize(word)) === index,
  )
  if (field === "chat" || field === "from")
    candidates = [...new Set(messages.map((row) => row[field]))].map((label) => ({
      label,
      insert: JSON.stringify(label),
      detail: field,
    }))
  else if (field === "date") candidates = dates.map((row) => ({ ...row, labelKey: row.key, detail: row.insert }))
  else if (field === "text")
    candidates = [
      ...textValues.slice(0, 7).map((label) => ({ label, insert: label, detail: "text" })),
      { label: '"final invoice"', insert: '"final invoice"', detail: "phrase" },
    ]
  else if (field === "body")
    candidates = [
      { label: "Contains invoice", insert: "/.*invoice.*/", detail: "body", labelKey: "containsInvoice" },
      { label: "Contains Atlas", insert: "/.*Atlas.*/", detail: "body", labelKey: "containsAtlas" },
    ]
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
  const end =
    field === "date" && clause
      ? clause.end - cursor
      : fragmentMatch?.[2].startsWith('"')
        ? quoteEnd < 0
          ? 0
          : quoteEnd + 1
        : (right.match(/^[^\s)]*/u)?.[0].length ?? 0)
  return candidates
    .filter(
      (row) =>
        !fragment ||
        normalize(row.label).includes(normalize(fragment)) ||
        normalize(row.insert).includes(normalize(fragment)) ||
        field === "date",
    )
    .slice(0, 20)
    .map((row) => ({
      label: row.label,
      detail: row.detail,
      labelKey: row.labelKey,
      value: query.slice(0, from) + (field === "date" ? `date:${row.insert}` : row.insert) + query.slice(cursor + end),
      cursor: from + row.insert.length + (field === "date" ? 5 : 0),
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
