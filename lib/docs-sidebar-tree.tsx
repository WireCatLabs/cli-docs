import type { Node, Root } from "fumadocs-core/page-tree"
import {
  Activity,
  Archive,
  BookOpen,
  Bot,
  Cable,
  Download,
  FlaskConical,
  Globe,
  History,
  Layers,
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
  architecture: Network,
  "search-architecture": Layers,
  "search-playground": FlaskConical,
  "bot-api": Webhook,
  "browser-apps": Globe,
  usage: MessageSquare,
  sessions: Users,
  archive: Archive,
  search: Search,
  groups: Users,
  "group-admins": Users,
  people: Users,
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
    return Icon ? { ...node, icon: node.icon ?? <Icon aria-hidden="true" /> } : node
  }
  return { ...tree, children: tree.children.map(decorate) }
}
