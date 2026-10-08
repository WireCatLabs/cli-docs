import type { Node, Root } from "fumadocs-core/page-tree"
import {
  Activity,
  Archive,
  BookOpen,
  Bot,
  Cable,
  CalendarDays,
  ContactRound,
  Download,
  FlaskConical,
  Globe,
  History,
  Layers,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Network,
  Route,
  Search,
  Settings2,
  ShieldCheck,
  Terminal,
  Users,
  Webhook,
  Wrench,
} from "lucide-react"

const icons = {
  index: BookOpen,
  installation: Download,
  agents: Bot,
  "first-tasks": ListChecks,
  prompting: MessageSquare,
  features: LayoutGrid,
  people: ContactRound,
  "meeting-brief": CalendarDays,
  architecture: Layers,
  "search-architecture": Network,
  "search-playground": FlaskConical,
  "bot-api": Webhook,
  "browser-apps": Globe,
  usage: MessageSquare,
  sessions: Users,
  archive: Archive,
  search: Search,
  groups: Users,
  bot: Bot,
  mcp: Cable,
  remote: Globe,
  recipes: ListChecks,
  commands: Terminal,
  configuration: Settings2,
  diagnostics: Activity,
  troubleshooting: Wrench,
  security: ShieldCheck,
  changelog: History,
  roadmap: Route,
}

/** One navigation tree on every page: tool folders expand, never replace the shared menu. */
export function unifiedDocsTree(tree: Root): Root {
  const decorate = (node: Node): Node => {
    if (node.type === "folder")
      return {
        ...node,
        root: false,
        defaultOpen: false,
        icon: node.icon ?? <MessageSquare aria-hidden="true" />,
        children: node.children.map(decorate),
      }
    if (node.type !== "page") return node
    const slug = /\/docs\/(tg|max)\/?$/.test(node.url) ? "index" : (node.url.split("/").filter(Boolean).at(-1) ?? "")
    const Icon = icons[slug as keyof typeof icons]
    const PageIcon = Icon ?? BookOpen
    return { ...node, icon: node.icon ?? <PageIcon aria-hidden="true" /> }
  }
  return { ...tree, children: tree.children.map(decorate) }
}
