import Link from "next/link"
import { i18n } from "@/lib/i18n"
import { tools } from "@/lib/shared"
import { wordsFor } from "@/lib/words"

type Props = { params: Promise<{ lang: string }> }

export default async function HomePage(props: Props) {
  const { lang } = await props.params
  const words = wordsFor(lang)
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-3">{words.tagline}</h1>
      <p className="text-fd-muted-foreground mb-10">{words.intro}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <section key={tool.name} className="rounded-xl border bg-fd-card p-5 flex flex-col gap-3">
            <h2 className="text-xl font-semibold font-mono">{tool.name}</h2>
            <p className="text-sm text-fd-muted-foreground flex-1">
              {tool.summary[lang as keyof typeof tool.summary] ?? tool.summary.en}
            </p>
            <pre className="text-xs rounded-md bg-fd-muted px-3 py-2 overflow-x-auto">
              <code>npm install -g {tool.package}</code>
            </pre>
            <div className="flex gap-4 text-sm font-medium">
              <Link href={`/${lang}/docs/${tool.name}`} className="underline">
                {words.docs}
              </Link>
              <a href={`https://github.com/${tool.repo}`} className="underline">
                {words.source}
              </a>
            </div>
          </section>
        ))}
      </div>
      <p className="text-xs text-fd-muted-foreground mt-10">{words.agents}</p>
    </main>
  )
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}
