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
