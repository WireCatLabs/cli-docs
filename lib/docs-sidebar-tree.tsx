import type { Folder, Item, Node, Root, Separator } from "fumadocs-core/page-tree"
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
  GlobeLock,
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
  Monitor,
  Network,
  NotebookPen,
  Paperclip,
  PenLine,
  Reply,
  Rocket,
  Route,
  ScrollText,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  StickyNote,
  Store,
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
import { type Tool, tools } from "./shared"
import { wordsFor } from "./words"

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
  mirrors: ArrowRightLeft,
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
  skills: Store,
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
  "build-create-cli": Rocket,
  "build-concepts": Lightbulb,
  "build-add-source": Cable,
  "build-own-data": Database,
  "build-sign-in": KeyRound,
  "build-stay-compliant": ShieldCheck,
  desktop: Monitor,
  logs: ScrollText,
  "tailscale-funnel": GlobeLock,
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

const folderTool = (node: Node): string | undefined => {
  if (node.type !== "folder") return undefined
  const first = node.index ?? node.children.find((child) => child.type === "page")
  return first?.type === "page" ? /\/docs\/([a-z0-9-]+)(?:\/|$)/.exec(first.url)?.[1] : undefined
}

/** Community tools leave our Tools group for their own, which exists only while one is listed. */
export function withCommunityGroup(children: Node[], lang: string, list: readonly Tool[] = tools): Node[] {
  const community = new Set(list.filter((tool) => tool.community).map((tool) => tool.name))
  const ours = new Set(list.filter((tool) => !tool.community).map((tool) => tool.name))
  const isCommunity = (node: Node) => community.has(folderTool(node) ?? "")
  const moved = children.filter(isCommunity)
  if (!moved.length) return children
  const rest = children.filter((node) => !isCommunity(node))
  const lastOurs = rest.findLastIndex((node) => ours.has(folderTool(node) ?? ""))
  const at = lastOurs < 0 ? rest.length : lastOurs + 1
  const separator: Separator = {
    type: "separator",
    $id: `community-tools-${lang}`,
    name: wordsFor(lang).navigation.communityTools,
  }
  return [...rest.slice(0, at), separator, ...moved, ...rest.slice(at)]
}

/** One navigation tree on every page: tool folders expand, never replace the shared menu. */
export function unifiedDocsTree(tree: Root, lang = "en"): Root {
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
                : firstPage?.type === "page" && /\/docs\/desktop(?:\/|$)/.test(firstPage.url)
                  ? Monitor
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
  return { ...tree, children: withCommunityGroup(tree.children, lang).map(decorate) }
}
