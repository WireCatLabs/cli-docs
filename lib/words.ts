export type Words = {
  tagline: string
  intro: string
  docs: string
  source: string
  install: string
  inLanguage: (language: string) => string
  agents: string
}

const languageName: Record<string, Record<string, string>> = {
  en: { en: "English", ru: "Russian", es: "Spanish" },
  ru: { en: "английском", ru: "русском", es: "испанском" },
  es: { en: "inglés", ru: "ruso", es: "español" },
}

export const words: Record<string, Words> = {
  en: {
    tagline: "Command line tools for people and AI agents",
    intro: "One operation per call, one JSON value on stdout, a fixed exit code for every kind of failure.",
    docs: "Documentation",
    source: "Source",
    install: "Install",
    inLanguage: (language) => `This page is in ${languageName.en?.[language] ?? language}.`,
    agents: "For agents: every page as Markdown in /llms.txt and /llms-full.txt.",
  },
  ru: {
    tagline: "Программы для терминала — для людей и ИИ-агентов",
    intro: "Одна операция на вызов, один JSON на stdout, постоянный код возврата для каждой ошибки.",
    docs: "Документация",
    source: "Исходный код",
    install: "Установка",
    inLanguage: (language) => `Эта страница на ${languageName.ru?.[language] ?? language} языке.`,
    agents: "Для агентов: каждая страница в Markdown — /llms.txt и /llms-full.txt.",
  },
  es: {
    tagline: "Herramientas de línea de comandos para personas y agentes de IA",
    intro: "Una operación por llamada, un valor JSON en stdout, un código de salida fijo para cada fallo.",
    docs: "Documentación",
    source: "Código fuente",
    install: "Instalar",
    inLanguage: (language) => `Esta página está en ${languageName.es?.[language] ?? language}.`,
    agents: "Para agentes: cada página en Markdown en /llms.txt y /llms-full.txt.",
  },
}

export const wordsFor = (lang: string): Words => words[lang] ?? (words.en as Words)
