import { Landing } from "@/components/landing"
import { i18n } from "@/lib/i18n"
import en from "@/lib/landing/en.json"
import es from "@/lib/landing/es.json"
import ru from "@/lib/landing/ru.json"

type Props = { params: Promise<{ lang: string }> }

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  const content = lang === "ru" ? ru : lang === "es" ? es : en
  return <Landing {...content} />
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}
