import { diagrams, type Lang } from "@/lib/architecture-diagrams"

const tones = {
  tool: "border-fd-primary/50 bg-fd-primary/10",
  shared: "border-fd-border bg-fd-card",
  core: "border-fd-border bg-fd-secondary",
  outside: "border-dashed border-fd-border bg-transparent",
} as const

const Arrow = () => (
  <svg
    className="mx-auto my-1 block text-fd-muted-foreground"
    width="14"
    height="18"
    viewBox="0 0 14 18"
    aria-hidden="true"
  >
    <path d="M7 0v15M2 10l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

/** A box diagram drawn from data, so its labels follow the page language and its colours the theme. */
export function ArchitectureDiagram({ name, lang = "en" }: { name: keyof typeof diagrams; lang?: Lang }) {
  const diagram = diagrams[name]?.[lang] ?? diagrams[name]?.en
  if (!diagram) return null
  return (
    <figure
      className="not-prose my-6 rounded-xl border border-fd-border bg-fd-background p-4"
      aria-label={diagram.title}
    >
      <figcaption className="mb-3 text-center text-sm font-semibold text-fd-foreground">{diagram.title}</figcaption>
      {diagram.rows.map((row, index) => (
        <div key={row.boxes.map((box) => box.name).join()}>
          {index > 0 && <Arrow />}
          {row.label && (
            <p className="mb-1 text-center text-xs uppercase tracking-wide text-fd-muted-foreground">{row.label}</p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            {row.boxes.map((box) => (
              <div
                key={box.name}
                className={`flex-1 rounded-lg border px-3 py-2 text-center ${tones[box.tone ?? "shared"]}`}
              >
                <div className="font-mono text-sm font-semibold text-fd-foreground">{box.name}</div>
                <div className="text-xs text-fd-muted-foreground">{box.note}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </figure>
  )
}
