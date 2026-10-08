import Link from "next/link"
import { AgentPrompt } from "@/components/text-snippet"
import { readerGuide } from "@/lib/reader-guides"

export function ReaderGuide({ slugs, lang }: { slugs: string[]; lang: string }) {
  const guide = readerGuide(slugs, lang)
  if (!guide) return null
  return (
    <div data-reader-guide lang={lang}>
      <p>{guide.intro}</p>
      {guide.sections.map((section) => (
        <section key={section.id}>
          <h2 id={section.id}>{section.title}</h2>
          <AgentPrompt text={section.prompt} language={lang} />
          <p>{section.result}</p>
          <p>
            <Link href={`/${lang}/docs/${section.page}`}>{section.link} →</Link>
          </p>
        </section>
      ))}
      {guide.fixture && (
        <section data-report-fixture>
          <h2 id="task-incomplete-history">{guide.fixture.title}</h2>
          <p>{guide.fixture.intro}</p>
          <p className="rounded-xl border bg-fd-muted p-4 font-medium">{guide.fixture.totals}</p>
          <figure className="my-6 rounded-xl border p-4" data-report-activity>
            <figcaption className="mb-4 font-medium">{guide.fixture.activityTitle}</figcaption>
            <ol className="m-0 grid list-none grid-cols-7 gap-2 p-0" aria-label={guide.fixture.activityTitle}>
              {guide.fixture.activity.map((count, index) => (
                <li key={count} className="flex min-w-0 flex-col items-center gap-2">
                  <span className="text-xs tabular-nums">{count}</span>
                  <div className="flex h-28 w-full items-end justify-center" aria-hidden="true">
                    <div
                      className="w-full max-w-10 rounded-t bg-fd-primary"
                      style={{ height: `${(count / 135) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">{index + 1}</span>
                </li>
              ))}
            </ol>
          </figure>
          {/* biome-ignore lint/a11y/useSemanticElements: A named scrolling region keeps the example table usable without adding a landmark. */}
          <div
            className="docs-reference-table overflow-auto"
            role="group"
            aria-label={guide.fixture.title}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users must be able to scroll the table.
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  {guide.fixture.headers.map((header) => (
                    <th key={header} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.fixture.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>{guide.fixture.outcome}</p>
          <p>{guide.fixture.limit}</p>
          <p>
            <Link href={`/${lang}/docs/search`}>{guide.fixture.next} →</Link>
          </p>
        </section>
      )}
    </div>
  )
}
