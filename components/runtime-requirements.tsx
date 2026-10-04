import { DocTerm } from "@/components/doc-term"

const copy = {
  en: { version: "22.16+ (22.x) or 24+", with: "with" },
  ru: { version: "22.16+ (ветка 22.x) или 24+", with: "с" },
  es: { version: "22.16+ (rama 22.x) o 24+", with: "con" },
}

export function RuntimeRequirements({ lang }: { lang: string }) {
  const text = copy[lang as keyof typeof copy] ?? copy.en
  return (
    <>
      <DocTerm term="nodejs" label="Node.js" lang={lang} /> {text.version} {text.with}{" "}
      <DocTerm term="npm" label="npm" lang={lang} />.
    </>
  )
}
