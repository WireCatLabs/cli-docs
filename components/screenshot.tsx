/** Without `src` it renders a labelled placeholder, so a page can be reviewed before its screenshot exists. */
export function Screenshot({
  src,
  alt,
  caption,
  width,
  lang = "en",
}: {
  src?: string
  alt: string
  caption?: string
  width?: number
  lang?: string
}) {
  return (
    <figure className="not-prose my-5" style={{ maxWidth: width ?? 520 }}>
      {src ? (
        // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
        <img src={src} alt={alt} loading="lazy" className="w-full rounded-lg border shadow-sm" />
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-lg border-2 border-dashed p-6 text-center text-sm text-fd-muted-foreground">
          {{ en: "Screenshot needed", ru: "Нужен скриншот", es: "Falta una captura" }[lang] ?? "Screenshot needed"}:{" "}
          {alt}
        </div>
      )}
      {caption && <figcaption className="mt-2 text-sm text-fd-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}
