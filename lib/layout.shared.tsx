import { uiTranslations } from "fumadocs-ui/i18n"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { WirecatLogo } from "@/components/wirecat-logo"
import { i18n } from "@/lib/i18n"
import { repository } from "@/lib/shared"

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: "English" },
    ru: {
      displayName: "Русский",
      "Search(search trigger)": "Поиск",
      "Search(search dialog)": "Поиск",
      "Open Search(search trigger)(aria-label)": "Открыть поиск",
      "Close Search(search dialog)(aria-label)": "Закрыть поиск",
      "No results found(search dialog)": "Ничего не найдено",
      "Choose a language(language switcher)": "Выбрать язык",
      "Choose a language(language switcher)(aria-label)": "Выбрать язык",
      "On this page(table of contents)": "На этой странице",
      "Copy Markdown(page actions)": "Копировать Markdown",
      "Copied Markdown(page actions)": "Markdown скопирован",
      "Open(page actions)": "Открыть",
      "View as Markdown(page actions)": "Открыть Markdown",
      "Next Page(pagination)": "Следующая страница",
      "Previous Page(pagination)": "Предыдущая страница",
    },
    es: {
      displayName: "Español",
      "Search(search trigger)": "Buscar",
      "Search(search dialog)": "Buscar",
      "Open Search(search trigger)(aria-label)": "Abrir búsqueda",
      "Close Search(search dialog)(aria-label)": "Cerrar búsqueda",
      "No results found(search dialog)": "Sin resultados",
      "Choose a language(language switcher)": "Elegir idioma",
      "Choose a language(language switcher)(aria-label)": "Elegir idioma",
      "On this page(table of contents)": "En esta página",
      "Copy Markdown(page actions)": "Copiar Markdown",
      "Copied Markdown(page actions)": "Markdown copiado",
      "Open(page actions)": "Abrir",
      "View as Markdown(page actions)": "Ver Markdown",
      "Next Page(pagination)": "Página siguiente",
      "Previous Page(pagination)": "Página anterior",
    },
  })

export function baseOptions(lang: string): BaseLayoutProps {
  return { nav: { title: <WirecatLogo />, url: `/${lang}` }, githubUrl: repository }
}
