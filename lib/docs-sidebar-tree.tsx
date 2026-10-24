import type { Folder, Item, Node, Root } from "fumadocs-core/page-tree"
import {
  Activity,
  Archive,
  ArrowRightLeft,
  AtSign,
  Blocks,
  BookOpen,
  Bot,
  Braces,
  Brain,
  BrainCircuit,
  Cable,
  ChartColumn,
  ContactRound,
  Database,
  Download,
  FileChartColumn,
  FileCode2,
  FileSearch,
  FileText,
  FlaskConical,
  FolderOpen,
  Gauge,
  GitMerge,
  Globe,
  History,
  KeyRound,
  Layers,
  LayoutGrid,
  Lightbulb,
  Link2,
  ListChecks,
  ListFilter,
  ListOrdered,
  ListTodo,
  LockKeyhole,
  Mail,
  MessageSquare,
  Mic,
  Network,
  NotebookPen,
  Paperclip,
  PenLine,
  Reply,
  Route,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  StickyNote,
  Tag,
  Terminal,
  UserRound,
  UserRoundCog,
  Users,
  Video,
  Webhook,
  Wrench,
} from "lucide-react"
import { commandGroupCopy, commandGroups, commandLanguage } from "./command-groups"
import { readerGuide } from "./reader-guides"

export const sidebarIcons = {
  features: LayoutGrid,
  memo: NotebookPen,
  organize: Layers,
  drive: FolderOpen,
  email: Mail,
  mail: Mail,
  notes: StickyNote,
  tags: Tag,
  tasks: ListTodo,
  memories: Brain,
  "how-it-works": Lightbulb,
  zoom: Video,
  zm: Video,
  "zoom-app": KeyRound,
  "remote-meetings": Video,
  attachments: Paperclip,
  "audio-recognition": Mic,
  "external-models": BrainCircuit,
  rankings: ChartColumn,
  permissions: LockKeyhole,
  profiles: UserRoundCog,
  "topic-search": Search,
  "query-language": Braces,
  "configuration-reference": SlidersHorizontal,
  "cli-contract": FileCode2,
  limits: Gauge,
  compare: ArrowRightLeft,
  replies: Reply,
  index: BookOpen,
  installation: Download,
  agents: Bot,
  "first-tasks": ListChecks,
  prompting: MessageSquare,
  "drafts-and-templates": PenLine,
  architecture: Network,
  "code-design": Blocks,
  "data-model": Database,
  testing: FlaskConical,
  "search-architecture": Layers,
  "tasks-architecture": GitMerge,
  "what-is-indexed": FileSearch,
  "how-things-are-linked": Link2,
  "search-efficiently": ListFilter,
  "search-playground": FlaskConical,
  "bot-api": Webhook,
  "browser-apps": Globe,
  usage: MessageSquare,
  sessions: KeyRound,
  archive: Archive,
  search: Search,
  groups: Users,
  "group-admins": Users,
  "group-analytics": ChartColumn,
  "group-analytics-example": FileChartColumn,
  people: ContactRound,
  mentions: AtSign,
  bot: Bot,
  mcp: Cable,
  remote: Globe,
  recipes: ListChecks,
  scenarios: ListOrdered,
  commands: Terminal,
  configuration: Settings2,
  diagnostics: Activity,
  troubleshooting: Wrench,
  security: ShieldCheck,
  changelog: History,
  roadmap: Route,
}

const commandIcons = { personal: UserRound, bot: Bot, admin: ShieldCheck, setup: Wrench }

function commandFolder(index: Item, lang: string): Folder {
  const text = commandGroupCopy[commandLanguage(lang)]
  const base = index.url.replace(/\/$/, "")
  return {
    type: "folder",
    name: index.name,
    icon: index.icon,
    index,
    defaultOpen: false,
    children: commandGroups.map((group) => {
      const Icon = commandIcons[group]
      return { type: "page", name: text[group], url: `${base}-${group}`, icon: <Icon aria-hidden="true" /> }
    }),
  }
}

/** One navigation tree on every page: tool folders expand, never replace the shared menu. */
export function unifiedDocsTree(tree: Root): Root {
  const decorate = (node: Node): Node => {
    if (node.type === "folder") {
      const firstPage = node.index ?? node.children.find((child) => child.type === "page")
      const tool =
        firstPage?.type === "page" ? /\/docs\/(tg|max|wa|drive|memo|zm)(?:\/|$)/.exec(firstPage.url)?.[1] : undefined
      const Icon =
        tool === "tg"
          ? Send
          : tool === "max" || tool === "wa"
            ? MessageSquare
            : tool === "memo"
              ? NotebookPen
              : tool === "zm"
                ? Video
                : FolderOpen
      return {
        ...node,
        root: false,
        defaultOpen: false,
        icon: node.icon ?? <Icon aria-hidden="true" />,
        children: node.children.map(decorate),
      }
    }
    if (node.type !== "page") return node
    const slug = /\/docs\/(tg|max|wa|drive|memo|zm)\/?$/.test(node.url)
      ? "index"
      : (node.url.split("/").filter(Boolean).at(-1) ?? "")
    const Icon = sidebarIcons[slug as keyof typeof sidebarIcons] ?? FileText
    const task = /^\/(en|ru|es)\/docs\/(tg|max|wa)\/(usage|rankings|bot|groups)\/?$/.exec(node.url)
    const title = task ? readerGuide([task[2], task[3]], task[1])?.title : undefined
    const page = { ...node, name: title ?? node.name, icon: node.icon ?? <Icon aria-hidden="true" /> }
    const commands = /^\/(en|ru|es)\/docs\/(?:tg|max|wa)\/commands\/?$/.exec(node.url)
    return commands ? commandFolder(page, commands[1]) : page
  }
  return { ...tree, children: tree.children.map(decorate) }
}
