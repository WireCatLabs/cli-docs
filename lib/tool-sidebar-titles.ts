import { tools } from "./shared"

type Names = { en: string; ru: string; es: string }

// Tool pages come from each tool's release, so their short menu names live here instead of in frontmatter.
// tg/max/wa usage, rankings, bot and groups are absent: the sidebar names them after their reader guides.
const shared: Record<string, Names> = {
  index: { en: "Overview", ru: "Обзор", es: "Resumen" },
  installation: { en: "Install", ru: "Установка", es: "Instalar" },
  sessions: { en: "Sign-in", ru: "Вход", es: "Inicio de sesión" },
  archive: { en: "Local archive", ru: "Локальная копия", es: "Archivo local" },
  attachments: { en: "Attachments", ru: "Вложения", es: "Adjuntos" },
  "query-language": { en: "Query language", ru: "Язык запросов", es: "Lenguaje de consulta" },
  people: { en: "People", ru: "Люди", es: "Personas" },
  mcp: { en: "MCP server", ru: "MCP-сервер", es: "Servidor MCP" },
  remote: { en: "In the browser", ru: "В браузере", es: "En el navegador" },
  recipes: { en: "Recipes", ru: "Рецепты", es: "Recetas" },
  scenarios: { en: "Scenarios", ru: "Сценарии", es: "Escenarios" },
  compare: { en: "Comparison", ru: "Сравнение", es: "Comparativa" },
  "configuration-reference": { en: "Config reference", ru: "Справочник настроек", es: "Referencia de ajustes" },
  "cli-contract": { en: "In scripts", ru: "В скриптах", es: "En scripts" },
  limits: { en: "Limits", ru: "Ограничения", es: "Límites" },
  diagnostics: { en: "Diagnostics", ru: "Диагностика", es: "Diagnóstico" },
  troubleshooting: { en: "Troubleshooting", ru: "Решение проблем", es: "Solución de problemas" },
  security: { en: "Security", ru: "Безопасность", es: "Seguridad" },
}

const byTool: Record<string, Record<string, Names>> = {
  tg: {
    remote: { en: "Browser and phone", ru: "Браузер и телефон", es: "Navegador y teléfono" },
  },
  max: {
    "audio-recognition": { en: "Voice messages", ru: "Голосовые", es: "Mensajes de voz" },
    "external-models": { en: "External models", ru: "Внешние модели", es: "Modelos externos" },
  },
  wa: {
    sessions: { en: "Linking devices", ru: "Подключение", es: "Vinculación" },
    bot: { en: "Business bot", ru: "Бизнес-бот", es: "Bot de Business" },
  },
  mail: {
    outlook: { en: "Outlook", ru: "Outlook", es: "Outlook" },
    "oauth-microsoft": { en: "Microsoft app", ru: "Приложение Microsoft", es: "App de Microsoft" },
    "oauth-google": { en: "Google sign-in", ru: "Вход через Google", es: "Acceso con Google" },
  },
  zm: {
    mcp: { en: "MCP and skills", ru: "MCP и инструкции", es: "MCP y skills" },
    "remote-meetings": { en: "Manage meetings", ru: "Управление встречами", es: "Gestionar reuniones" },
  },
  memo: {
    sources: { en: "Your sources", ru: "Свои источники", es: "Tus fuentes" },
    import: { en: "Import", ru: "Импорт", es: "Importar" },
    people: { en: "People and projects", ru: "Люди и проекты", es: "Personas y proyectos" },
    remote: { en: "Browser and phone", ru: "Браузер и телефон", es: "Navegador y teléfono" },
    archive: { en: "Keeping up to date", ru: "Обновление", es: "Mantener al día" },
  },
  drive: {
    mirrors: { en: "Local mirrors", ru: "Локальные копии", es: "Copias locales" },
  },
}

/** The short menu name of a tool page at `tool/slug[.lang].md`, or undefined to keep its title. */
export function toolSidebarTitle(filePath: string, lang = "en"): string | undefined {
  const match = /^([a-z0-9]+)\/([a-z0-9-]+)(?:\.[a-z]{2})?\.mdx?$/.exec(filePath)
  if (!match || !tools.some((tool) => tool.name === match[1])) return undefined
  const names = byTool[match[1]]?.[match[2]] ?? shared[match[2]]
  return names?.[lang as keyof Names]
}
