import { desktopShotLang } from "@/lib/desktop-shots"

/** One WireCat Desktop screen, light and dark. Renders nothing until the capture exists, so a page can name it early. */
export function DesktopShot({
  shot,
  alt,
  caption,
  lang = "en",
  folder = "desktop",
}: {
  shot: string
  alt: string
  caption?: string
  lang?: string
  folder?: string
}) {
  const [width, height, maxWidth] = folder === "install" ? [1440, 480, "max-w-4xl"] : [1040, 650, "max-w-3xl"]
  const light = desktopShotLang(shot, "light", lang, folder)
  const dark = desktopShotLang(shot, "dark", lang, folder)
  if (!light || !dark) return null
  return (
    <figure className={`not-prose my-6 ${maxWidth}`}>
      {(
        [
          ["light", light, "[.dark_&]:hidden"],
          ["dark", dark, "hidden [.dark_&]:block"],
        ] as const
      ).map(([theme, from, visibility]) => (
        // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
        <img
          key={theme}
          className={`h-auto w-full rounded-xl border shadow-sm ${visibility}`}
          src={`/screenshots/${folder}/${shot}-${theme}-${from}.webp`}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          alt={alt}
        />
      ))}
      {caption && <figcaption className="mt-2 text-sm text-fd-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}
