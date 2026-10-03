import Link from "next/link"
import { InstallTool } from "@/components/install-tool"
import type { Tool } from "@/lib/shared"
import { wordsFor } from "@/lib/words"

const copy = {
  en: {
    intro:
      "Install with your local agent or in a terminal. The CLI is an npm package for Windows, macOS and Linux. Your agent can check the computer, install it and help you log in.",
    steps:
      "Open the block below and copy the request to your agent. After login, verify your account and a few chats. Downloading older history is a separate step.",
    tasks: "Try your first tasks",
    requests: "How to phrase requests",
    reference: "Manual setup and technical details",
  },
  ru: {
    intro:
      "Установите CLI через локального агента или в терминале. Это npm-пакет для Windows, macOS и Linux. Агент поможет проверить компьютер, установить CLI и войти в аккаунт.",
    steps:
      "Раскройте блок ниже и скопируйте запрос агенту. После входа проверьте свой аккаунт и несколько чатов. Загрузка старой истории — отдельный шаг.",
    tasks: "Попробовать первые задачи",
    requests: "Как формулировать запросы",
    reference: "Самостоятельная установка и технические детали",
  },
  es: {
    intro:
      "Instala el CLI con tu agente local o en la terminal. Es un paquete npm para Windows, macOS y Linux. El agente puede comprobar el ordenador, instalarlo y ayudarte a iniciar sesión.",
    steps:
      "Abre el bloque de abajo y copia la petición en tu agente. Después de iniciar sesión, comprueba tu cuenta y algunos chats. Descargar el historial antiguo es un paso aparte.",
    tasks: "Probar las primeras tareas",
    requests: "Cómo formular peticiones",
    reference: "Instalación manual y detalles técnicos",
  },
}

export function installationReferenceTitle(lang: string) {
  return (copy[lang as keyof typeof copy] ?? copy.en).reference
}

export function ToolInstallationIntro({ tool, lang }: { tool: Tool; lang: string }) {
  const text = copy[lang as keyof typeof copy] ?? copy.en
  return (
    <>
      <p>{text.intro}</p>
      <h2 id="agent-installation">{wordsFor(lang).navigation.installGuide}</h2>
      <p>{text.steps}</p>
      <div className="not-prose my-5">
        <InstallTool tool={tool} lang={lang} />
      </div>
      <p>
        <Link href={`/${lang}/docs/first-tasks`}>{text.tasks} →</Link>
        {" · "}
        <Link href={`/${lang}/docs/prompting`}>{text.requests}</Link>
      </p>
      <h2 id="installation-reference">{text.reference}</h2>
    </>
  )
}
