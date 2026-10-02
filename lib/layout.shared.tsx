import { uiTranslations } from "fumadocs-ui/i18n"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { Logo } from "@/components/logo"
import { i18n } from "@/lib/i18n"
import { repository } from "@/lib/shared"

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: "English" },
    ru: { displayName: "Русский" },
    es: { displayName: "Español" },
  })

export function baseOptions(lang: string): BaseLayoutProps {
  return { nav: { title: <Logo />, url: `/${lang}` }, githubUrl: repository }
}
