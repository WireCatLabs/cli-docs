import type { Node, Root } from "fumadocs-core/page-tree"
import {
  Activity,
  Archive,
  ArrowRightLeft,
  BookOpen,
  Bot,
  Braces,
  BrainCircuit,
  Cable,
  ChartColumn,
  ClipboardList,
  ContactRound,
  Download,
  FileCode2,
  FileText,
  FlaskConical,
  FolderOpen,
  Gauge,
  Globe,
  History,
  KeyRound,
  Layers,
  LayoutGrid,
  ListChecks,
  LockKeyhole,
  Mail,
  MessageSquare,
  Mic,
  Network,
  Paperclip,
  Reply,
  Route,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  UserRoundCog,
  Users,
  Webhook,
  Wrench,
} from "lucide-react"

export const sidebarIcons = {
  features: LayoutGrid,
  memo: Mail,
  attachments: Paperclip,
  "audio-recognition": Mic,
  "external-models": BrainCircuit,
  rankings: ChartColumn,
  permissions: LockKeyhole,
  profiles: UserRoundCog,
  "meeting-brief": ClipboardList,
  "topic-search": Search,
  "query-language": Braces,
  "configuration-reference": SlidersHorizontal,
  "cli-contract": FileCode2,
  limits: Gauge,
  "from-tgcli": ArrowRightLeft,
  replies: Reply,
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
  sessions: KeyRound,
  archive: Archive,
  search: Search,
  groups: Users,
  "group-admins": Users,
  people: ContactRound,
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
    if (node.type === "folder") {
      const firstPage = node.index ?? node.children.find((child) => child.type === "page")
      const tool = firstPage?.type === "page" ? /\/docs\/(tg|max)(?:\/|$)/.exec(firstPage.url)?.[1] : undefined
      const Icon = tool === "tg" ? Send : tool === "max" ? MessageSquare : FolderOpen
      return {
        ...node,
        root: false,
        defaultOpen: false,
        icon: node.icon ?? <Icon aria-hidden="true" />,
        children: node.children.map(decorate),
      }
    }
    if (node.type !== "page") return node
    const slug = /\/docs\/(tg|max)\/?$/.test(node.url) ? "index" : (node.url.split("/").filter(Boolean).at(-1) ?? "")
    const Icon = sidebarIcons[slug as keyof typeof sidebarIcons] ?? FileText
    return { ...node, icon: node.icon ?? <Icon aria-hidden="true" /> }
  }
  return { ...tree, children: tree.children.map(decorate) }
}
