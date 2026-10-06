import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import GithubSlugger from "github-slugger"
import { fromMarkdown } from "mdast-util-from-markdown"

type Node = {
  type: string
  value?: string
  lang?: string | null
  meta?: string | null
  depth?: number
  url?: string
  title?: string | null
  children?: Node[]
  data?: { hName?: string; hProperties?: Record<string, unknown> }
}
const textOf = (node: Node): string => node.value ?? node.children?.map(textOf).join("") ?? ""

function sectionEnd(children: Node[], start: number) {
  let end = start + 1
  while (
    end < children.length &&
    !(children[end].type === "heading" && (children[end].depth ?? 0) <= (children[start].depth ?? 0))
  )
    end++
  // An original-language alias immediately before the next heading belongs to that next section.
  while (end > start + 1 && children[end - 1].data?.hName === "span" && children[end - 1].data?.hProperties?.id) end--
  return end
}

export function commandReferences(markdown: string): Map<string, string> {
  const index = new Map<string, string>()
  const slugger = new GithubSlugger()
  for (const heading of fromMarkdown(markdown).children) {
    if (heading.type !== "heading") continue
    const title = textOf(heading as Node)
    const anchor = slugger.slug(title)
    if (/^(tg|max) [\w -]+$/.test(title)) index.set(title, anchor)
  }
  return index
}

export function resolveCommand(value: string, tool: string | undefined, indexes: Map<string, Map<string, string>>) {
  const normalized = value.replace(/\s+/g, " ").trim()
  const provider = /^(tg|max)\b/.exec(normalized)?.[1] ?? tool
  if (!provider) return
  const full = normalized.startsWith(`${provider} `) ? normalized : `${provider} ${normalized}`
  const index = indexes.get(provider)
  if (!index) return
  const command = [...index.keys()]
    .filter((candidate) => full === candidate || full.startsWith(`${candidate} `))
    .sort((a, b) => b.length - a.length)[0]
  if (command) return { tool: provider, command, anchor: index.get(command) }
}

/** Shared presentation for released Markdown; executable examples and anchors stay intact. */
function loadCommandIndexes() {
  const indexes = new Map<string, Map<string, string>>()
  for (const tool of ["tg", "max"]) {
    const file = join(process.cwd(), "content/docs", tool, "commands.md")
    if (existsSync(file)) indexes.set(tool, commandReferences(readFileSync(file, "utf8")))
  }
  return indexes
}

export function remarkDocUsability(indexes = loadCommandIndexes()) {
  return (tree: Node, file: { path?: string }) => {
    const path = (file.path ?? "").replaceAll("\\", "/")
    const tool = /\/docs\/(tg|max)\//.exec(path)?.[1]
    const language = /\.(ru|es)\.mdx?$/.exec(path)?.[1] ?? "en"
    const reference = { en: "Command reference", ru: "Справочник команды", es: "Referencia del comando" }[language]
    const installation = /\/installation(?:\.(?:ru|es))?\.mdx?$/.test(path) && tool
    let tableNumber = 0

    // Markdown drops raw HTML. Preserve the reviewed native-reference language boundary
    // as a structured node so assistive technology reads its descriptions in English.
    if (tree.children) {
      for (let i = 0; i < tree.children.length; i++) {
        const opening = tree.children[i]
        if (opening.type !== "html" || opening.value?.trim() !== '<div lang="en">') continue
        const end = tree.children.findIndex(
          (node, j) => j > i && node.type === "html" && node.value?.trim() === "</div>",
        )
        if (end < 0) continue
        const children = tree.children.slice(i + 1, end)
        tree.children.splice(i, end - i + 1, {
          type: "blockquote",
          data: { hName: "div", hProperties: { lang: "en" } },
          children,
        })
      }
    }

    const visit = (node: Node) => {
      if (node.type === "table") {
        tableNumber++
        node.data = {
          ...node.data,
          hProperties: {
            ...node.data?.hProperties,
            "data-table-label": `${{ en: "Reference table", ru: "Справочная таблица", es: "Tabla de referencia" }[language]} ${tableNumber}`,
          },
        }

        for (const cell of node.children?.[0]?.children ?? []) {
          if (!textOf(cell).trim())
            cell.children = [
              { type: "text", value: { en: "Requirement", ru: "Обязательность", es: "Obligatoriedad" }[language] },
            ]
        }
      }
      if (!node.children || ["link", "linkReference", "heading", "code", "html"].includes(node.type)) return
      if (
        node.type === "blockquote" &&
        node.children[0] &&
        [
          "See the my.telegram.org login screen",
          "Посмотреть экран входа my.telegram.org",
          "Ver la pantalla de acceso de my.telegram.org",
          "How are login credentials protected?",
          "Как защищены данные входа?",
          "¿Cómo se protegen las credenciales?",
          "What is a Telegram application and why is it needed?",
          "Что такое приложение Telegram и зачем оно нужно?",
          "¿Qué es una aplicación Telegram y para qué sirve?",
        ].includes(textOf(node.children[0]))
      ) {
        const id = textOf(node.children[0]).includes("my.telegram.org")
          ? "telegram-app-login"
          : /application|приложение|aplicación/.test(textOf(node.children[0]))
            ? "telegram-app-explained"
            : "credential-storage"
        node.data = { hName: "details", hProperties: { className: "docs-disclosure", id } }
        node.children[0].data = { hName: "summary" }
      }
      node.children = node.children.flatMap((child) => {
        if (child.type === "code" && child.meta === "prompt") {
          return [
            {
              type: "blockquote",
              data: { hName: "agent-prompt", hProperties: { text: child.value ?? "", language } },
              children: [child],
            },
          ]
        }
        if (child.type === "inlineCode" && !/\/commands(?:\.(?:ru|es))?\.md$/.test(path)) {
          const match = resolveCommand(child.value ?? "", tool, indexes)
          if (match) {
            return [
              child,
              {
                type: "link",
                url: `/${language}/docs/${match.tool}/commands#${match.anchor}`,
                title: `${reference}: ${match.command}`,
                data: {
                  hProperties: { className: "command-reference", "aria-label": `${reference}: ${match.command}` },
                },
                children: [{ type: "text", value: "↗" }],
              },
            ]
          }
        }
        visit(child)
        return [child]
      })
    }
    visit(tree)
    if (/\/remote(?:\.(?:ru|es))?\.md$/.test(path) && tree.children) {
      const labels = ["Windows (PowerShell)", "macOS (Terminal)", "Linux (Terminal)"]
      for (let i = 0; i < tree.children.length; i++) {
        if (tree.children[i].type !== "heading" || textOf(tree.children[i]) !== labels[0]) continue
        let end = i
        const panels: Node[] = []
        for (const [index, label] of labels.entries()) {
          const heading = tree.children[end]
          if (heading?.type !== "heading" || heading.depth !== 3 || textOf(heading) !== label) break
          const next = sectionEnd(tree.children, end)
          panels.push({
            type: "blockquote",
            data: { hName: "platform-setup-tab", hProperties: { value: ["Windows", "macOS", "Linux"][index] } },
            children: [
              { type: "paragraph", children: [{ type: "strong", children: heading.children }] },
              ...tree.children.slice(end + 1, next),
            ],
          })
          end = next
        }
        if (panels.length !== labels.length) continue
        tree.children.splice(i, end - i, {
          type: "blockquote",
          data: { hName: "platform-setup-tabs" },
          children: panels,
        })
      }
    }
    if (!installation || !tree.children) return
    for (let i = 0; i < tree.children.length; i++) {
      const heading = tree.children[i]
      if (
        heading.type === "heading" &&
        [
          "Shell completion",
          "Автодополнение в терминале",
          "Автодополнение",
          "Автокомплит",
          "Autocompletado",
          "Autocompletado en la terminal",
          "Autocompletado del shell",
        ].includes(textOf(heading))
      ) {
        const end = sectionEnd(tree.children, i)
        const alias = tree.children[i - 1]
        const start = ["shell-completion", "автодополнение"].includes(String(alias?.data?.hProperties?.id)) ? i - 1 : i
        tree.children.splice(start, end - start)
        i = start - 1
        continue
      }
      if (heading.type === "table") {
        const columns = heading.children?.[0]?.children?.map(textOf) ?? []
        if (columns.includes("Linux") && columns.includes("macOS") && columns.includes("Windows")) {
          tree.children[i] = {
            type: "blockquote",
            data: { hName: "platform-paths", hProperties: { language } },
            children: [heading],
          }
        }
      }
      if (
        heading.type !== "heading" ||
        !["From source", "Из исходного кода", "Из исходников", "Desde el código fuente"].includes(textOf(heading))
      )
        continue
      const end = sectionEnd(tree.children, i)
      const alias = tree.children[i - 1]
      const start = alias?.data?.hProperties?.id === "from-source" ? i - 1 : i
      const summary = tree.children.slice(start, i + 1)
      heading.data = { ...heading.data, hProperties: { ...heading.data?.hProperties, "data-static-heading": true } }
      const body = tree.children.slice(i + 1, end)
      tree.children.splice(start, end - start, {
        type: "blockquote",
        data: { hName: "details", hProperties: { className: "docs-disclosure" } },
        children: [{ type: "blockquote", data: { hName: "summary" }, children: summary }, ...body],
      })
      i = start
    }
  }
}
