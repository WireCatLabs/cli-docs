import { DocTerm } from "@/components/doc-term"
import { nodeMinimum } from "@/lib/words"

const copy = {
  en: { version: (min: string) => `${min}+ (22.x) or 24+`, with: "with" },
  ru: { version: (min: string) => `${min}+ (ветка 22.x) или 24+`, with: "с" },
  es: { version: (min: string) => `${min}+ (rama 22.x) o 24+`, with: "con" },
}

export function RuntimeRequirements({ lang, tool }: { lang: string; tool: string }) {
  const text = copy[lang as keyof typeof copy] ?? copy.en
  return (
    <>
      <DocTerm term="nodejs" label="Node.js" lang={lang} /> {text.version(nodeMinimum(tool))} {text.with}{" "}
      <DocTerm term="npm" label="npm" lang={lang} />.
    </>
  )
}
