import Link from "next/link"
import { AgentPrompt, CopyText } from "@/components/text-snippet"
import { readerGuide } from "@/lib/reader-guides"
import type { ReportTask } from "@/lib/report-tasks"

export function ReaderGuide({ slugs, lang }: { slugs: string[]; lang: string }) {
  const guide = readerGuide(slugs, lang)
  if (!guide) return null
  return (
    <div data-reader-guide lang={lang}>
      <p>{guide.intro}</p>
      {guide.showRoleNavigation && (
        <nav aria-label={guide.roleNavigation.label} className="not-prose my-5 flex flex-wrap gap-2" data-reader-roles>
          {guide.roleNavigation.links.map((link) => (
            <Link
              key={link.page}
              href={`/${lang}/docs/${link.page}`}
              aria-current={link.current ? "page" : undefined}
              className="rounded-lg border px-3 py-2 text-sm aria-[current=page]:bg-fd-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      {guide.setup && (
        <section data-bot-onboarding>
          <h2 id="task-bot-connect">{guide.setup.title}</h2>
          <p>
            <a href={guide.setup.url}>{guide.setup.create}</a>
          </p>
          {guide.setup.creationDetails && (
            <details data-botfather-help>
              <summary>{guide.setup.creationDetails.title}</summary>
              <ol>
                {guide.setup.creationDetails.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </details>
          )}
          <p>
            <Link href={`/${lang}/docs/installation`}>{guide.setup.install} →</Link>
          </p>
          <ol>
            {guide.setup.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <CopyText text={guide.setup.commands.join("\n")} lang={lang} />
          <p>{guide.setup.result}</p>
        </section>
      )}
      {guide.sections.slice(0, guide.fixture ? 1 : undefined).map((section) => (
        <ReaderSection key={section.id} section={section} lang={lang} />
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
      {guide.fixture &&
        guide.sections.slice(1).map((section) => <ReaderSection key={section.id} section={section} lang={lang} />)}
    </div>
  )
}

function ReaderSection({ section, lang }: { section: ReportTask; lang: string }) {
  return (
    <section data-reader-section={section.id}>
      <h2 id={section.id}>{section.title}</h2>
      <AgentPrompt text={section.prompt} language={lang} />
      <p>{section.result}</p>
      {section.example && (
        <>
          {/* biome-ignore lint/a11y/useSemanticElements: A named scrolling group makes wide data tables usable. */}
          <div
            className="docs-reference-table overflow-auto"
            role="group"
            aria-label={section.title}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the table.
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  {section.example.headers.map((header) => (
                    <th key={header} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.example.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={`${section.example?.headers[index]}:${cell}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>{section.example.note}</p>
        </>
      )}
      {section.commands && <CopyText text={section.commands.join("\n")} lang={lang} />}
      <p>
        <Link href={`/${lang}/docs/${section.page}`}>{section.link} →</Link>
      </p>
    </section>
  )
}
