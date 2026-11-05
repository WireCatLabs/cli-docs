import Link from "next/link"
import { desktopShotLang } from "@/lib/desktop-shots"

const copy = {
  en: {
    title: "Rather not use a terminal?",
    setup: (name: string, signIn: boolean) =>
      `WireCat Desktop installs the ${name} tool with one button, keeps it updated${signIn ? " and signs you in" : ""}.`,
    more: "The app also searches all your sources at once, keeps tasks and memory, shows analytics and connects your AI agents.",
    download: "Download WireCat Desktop",
    tour: "What the app does",
    alt: "WireCat Desktop: the Tools page with Telegram, MAX and WhatsApp installed and signed in",
  },
  ru: {
    title: "Не хотите работать в терминале?",
    setup: (name: string, signIn: boolean) =>
      `WireCat Desktop установит инструмент ${name} одной кнопкой, будет его обновлять${signIn ? " и поможет войти в аккаунт" : ""}.`,
    more: "Ещё приложение ищет сразу по всем источникам, ведёт задачи и память, показывает аналитику и подключает ваших ИИ-агентов.",
    download: "Скачать WireCat Desktop",
    tour: "Что умеет приложение",
    alt: "WireCat Desktop: страница «Инструменты», Telegram, MAX и WhatsApp установлены и подключены",
  },
  es: {
    title: "¿Prefieres no usar la terminal?",
    setup: (name: string, signIn: boolean) =>
      `WireCat Desktop instala la herramienta ${name} con un botón, la mantiene al día${signIn ? " y te ayuda a iniciar sesión" : ""}.`,
    more: "La app también busca en todas tus fuentes a la vez, guarda tareas y memoria, muestra estadísticas y conecta tus agentes de IA.",
    download: "Descargar WireCat Desktop",
    tour: "Qué hace la app",
    alt: "WireCat Desktop: la página Herramientas con Telegram, MAX y WhatsApp instalados y con sesión iniciada",
  },
}

/** Shown above every tool's installation guide, which is synced from the tool's repository and cannot carry it. */
export function DesktopTip({ name, signIn, lang }: { name: string; signIn: boolean; lang: string }) {
  const words = copy[lang as keyof typeof copy] ?? copy.en
  const tour = `/${lang}/docs/desktop`
  const shots = (["light", "dark"] as const).map(
    (theme) => [theme, desktopShotLang("tools", theme, lang, "desktop/docs")] as const,
  )
  return (
    <aside lang={lang} className="not-prose my-6 flex gap-4 rounded-xl border bg-fd-card p-4" data-desktop-tip>
      <Link href={tour} className="w-28 shrink-0 self-start sm:w-44">
        {shots.map(([theme, from]) =>
          from ? (
            // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
            <img
              key={theme}
              className={`h-auto w-full rounded-md border ${theme === "light" ? "[.dark_&]:hidden" : "hidden [.dark_&]:block"}`}
              src={`/screenshots/desktop/docs/tools-${theme}-${from}.webp`}
              width={1040}
              height={650}
              loading="lazy"
              decoding="async"
              alt={words.alt}
            />
          ) : null,
        )}
      </Link>
      <div className="min-w-0 space-y-1.5 text-sm">
        <p className="font-semibold">{words.title}</p>
        <p>{words.setup(name, signIn)}</p>
        <p className="text-fd-muted-foreground">{words.more}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1 font-medium">
          <Link className="underline" href={`/${lang}/download`}>
            {words.download} →
          </Link>
          <Link className="underline" href={tour}>
            {words.tour} →
          </Link>
        </p>
      </div>
    </aside>
  )
}
