import Link from "next/link"
import { commandRules } from "@/lib/command-rules"

export function CommandRules({ tool, lang }: { tool: string; lang: string }) {
  const rules = commandRules(tool, lang)
  if (!rules) return null
  return (
    <section className="not-prose space-y-3" data-command-rules>
      <h2 className="text-xl font-semibold">{rules.heading}</h2>
      <pre className="overflow-x-auto rounded-lg border bg-fd-secondary p-3 text-sm">
        <code>{rules.shape}</code>
      </pre>
      <ul className="list-disc space-y-2 pl-5">
        {rules.items.map((item) => (
          <li key={item}>{withCode(item)}</li>
        ))}
      </ul>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {Object.entries(rules.links).map(([slug, label]) => (
          <Link key={slug} className="underline" href={`/${lang}/docs/${tool}/${slug}`}>
            {label} →
          </Link>
        ))}
      </p>
    </section>
  )
}

const withCode = (text: string) =>
  text.split("`").map((part, index) => (index % 2 ? <code key={part}>{part}</code> : part))
