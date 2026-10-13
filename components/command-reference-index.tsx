import { Bot, ShieldCheck, UserRound } from "lucide-react"
import Link from "next/link"
import { commandGroup, commandGroupCopy, commandGroups, commandLanguage } from "@/lib/command-groups"
import { CommandHashRedirect } from "./command-hash-redirect"
export function CommandReferenceIndex({
  tool,
  lang,
  markdownUrl,
  commands,
  aliases,
}: {
  tool: string
  lang: string
  markdownUrl: string
  commands: [string, string][]
  aliases: string[]
}) {
  const text = commandGroupCopy[commandLanguage(lang)]
  const icons = { personal: UserRound, bot: Bot, admin: ShieldCheck }
  const messenger = tool === "max" ? "MAX" : "Telegram"
  return (
    <div className="not-prose space-y-5" data-command-index>
      {/* Remember legacy fragments before hydration can restore a URL without the hash. */}
      <script>{`(() => {
        const path = location.pathname;
        const fragments = window.__wirecatCommandFragments ||= {};
        const remember = () => {
          if (location.pathname === path) fragments[path] = location.hash;
        };
        remember();
        window.addEventListener("hashchange", remember);
      })();`}</script>
      <CommandHashRedirect tool={tool} lang={lang} />
      <p>
        {text.intro}{" "}
        <Link className="underline" href={`/${lang}/docs/first-tasks`}>
          {text.task} →
        </Link>
      </p>
      <div className="grid gap-3">
        {commandGroups.map((group) => {
          const Icon = icons[group]
          return (
            <Link
              key={group}
              href={`/${lang}/docs/${tool}/commands-${group}`}
              className="flex gap-4 rounded-xl border bg-fd-card p-5 hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            >
              <Icon className="mt-1 shrink-0 text-fd-primary" size={24} aria-hidden="true" />
              <div>
                <span className="block text-lg font-semibold">{text[group]}</span>
                <span className="mt-1 block text-sm text-fd-muted-foreground">{text.descriptions[group]}</span>
              </div>
            </Link>
          )
        })}
      </div>
      <details className="rounded-xl border bg-fd-card p-4">
        <summary className="cursor-pointer font-medium">
          {{ ru: "Найти команду по названию", en: "Find a command by name", es: "Encontrar un comando por nombre" }[
            lang
          ] ?? "Find a command by name"}
        </summary>
        <ul className="mt-4 space-y-2 text-sm">
          {commands.map(([command, anchor]) => (
            <li key={anchor}>
              <a
                id={anchor}
                className="font-mono underline"
                href={`/${lang}/docs/${tool}/commands-${commandGroup(command)}#${anchor}`}
              >
                {command}
              </a>
            </li>
          ))}
        </ul>
      </details>
      <section className="space-y-3" data-command-rules>
        <h2 className="text-xl font-semibold">{text.rules.heading}</h2>
        <pre className="overflow-x-auto rounded-lg border bg-fd-secondary p-3 text-sm">
          <code>{`${tool} [profile] [options] <resource> <action> [arguments]`}</code>
        </pre>
        <ul className="list-disc space-y-2 pl-5">
          {text.rules.items.map((item) => (
            <li key={item}>{withCode(item.replaceAll("{tool}", tool).replaceAll("{messenger}", messenger))}</li>
          ))}
        </ul>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {Object.entries(text.rules.links).map(([slug, label]) => (
            <Link key={slug} className="underline" href={`/${lang}/docs/${tool}/${slug}`}>
              {label} →
            </Link>
          ))}
        </p>
      </section>
      {aliases
        .filter((id) => !commands.some(([, anchor]) => anchor === id))
        .map((id) => (
          <span key={id} id={id} />
        ))}
      <a className="block text-sm underline" href={markdownUrl}>
        {text.all} →
      </a>
    </div>
  )
}

const withCode = (text: string) =>
  text.split("`").map((part, index) => (index % 2 ? <code key={part}>{part}</code> : part))
