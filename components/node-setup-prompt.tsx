import { CopyText } from "@/components/text-snippet"
import { wordsFor } from "@/lib/words"

export function NodeSetupPrompt({ lang = "en" }: { lang?: string }) {
  return <CopyText text={wordsFor(lang).onboarding.nodePrompt} lang={lang} kind="prompt" />
}
