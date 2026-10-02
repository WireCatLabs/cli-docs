import type { Metadata } from "next"
import { Landing } from "@/components/landing/landing"
import { i18n } from "@/lib/i18n"
import { landingTitle, translator } from "@/lib/landing/i18n"

type Props = { params: Promise<{ lang: string }> }

export default async function HomePage(props: Props) {
  const { lang } = await props.params
  return <Landing lang={lang} />
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params
  const { t } = translator(lang)
  const description = `${t("Connect Claude Code, Codex or another agent to your messengers. Find who owes what in")} ${t("Telegram and MAX")}${t(", set reminders and let it reply for you.")}`
  return { title: { absolute: landingTitle(lang) }, description, openGraph: { title: landingTitle(lang), description } }
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}
