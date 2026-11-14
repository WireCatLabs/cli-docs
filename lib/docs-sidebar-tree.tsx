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
  CalendarDays,
  ChartColumn,
  ContactRound,
  Cpu,
  Database,
  Download,
  FileChartColumn,
  FileCode2,
  FilePlus2,
  FileSearch,
  FileText,
  FlaskConical,
  FolderOpen,
  Gauge,
  GitMerge,
  Globe,
  GlobeLock,
  Handshake,
  History,
  Import,
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
  Newspaper,
  NotebookPen,
  PackagePlus,
  Paperclip,
  PenLine,
  Phone,
  PhoneCall,
  Reply,
  Rocket,
  Route,
  ScrollText,
  Search,
  Send,
  Server,
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
  Wallet,
  Webhook,
  Wrench,
} from "lucide-react"
import { WhatsAppIcon } from "../components/brand-icons"
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
  b24: Handshake,
  asterisk: Server,
  pbx: PhoneCall,
  notes: StickyNote,
  sources: FilePlus2,
  tags: Tag,
  tasks: ListTodo,
  memories: Brain,
  business: Wallet,
  "how-it-works": Lightbulb,
  meetings: Video,
  zm: Video,
  telemost: Video,
  gcal: CalendarDays,
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
  "build-import-data": Import,
  "build-add-source": Cable,
  "build-own-data": Database,
  "build-sign-in": KeyRound,
  "build-list-tool": Store,
  "build-stay-compliant": ShieldCheck,
  desktop: Monitor,
  logs: ScrollText,
  "tailscale-funnel": GlobeLock,
  contacts: ContactRound,
  clients: Handshake,
  digests: Newspaper,
  memory: Brain,
  "ai-model": BrainCircuit,
  "own-tools": PackagePlus,
  "local-models": Cpu,
}

const folderIcons = {
  tg: Send,
  max: MessageSquare,
  wa: WhatsAppIcon,
  drive: FolderOpen,
  gcal: CalendarDays,
  mail: Mail,
  memo: NotebookPen,
  b24: Handshake,
  pbx: PhoneCall,
  zm: Video,
  desktop: Monitor,
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

const toolOf = (node: Node): string | undefined =>
  node.type === "page" ? /\/docs\/([a-z0-9-]+)$/.exec(node.url)?.[1] : folderTool(node)

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

// A tool listed here, by its folder or its single page, sits in a folder of its own inside "Connect a source", at the
// place of the group's first tool.
// The folder has no page, so the tools keep their URLs. `open` is whether it starts expanded.
const toolGroups = {
  meetingsCalls: { tools: ["zm", "telemost", "pbx"], open: true, icon: Phone },
  crm: { tools: ["b24"], open: false, icon: Handshake },
} as const

export const toolGroupId = (group: string, lang: string) => `tools-${group}-${lang}`

export function withToolGroups(children: Node[], lang: string): Node[] {
  const groupOf = (node: Node) =>
    (Object.keys(toolGroups) as (keyof typeof toolGroups)[]).find((group) =>
      (toolGroups[group].tools as readonly string[]).includes(toolOf(node) ?? ""),
    )
  const out: Node[] = []
  const placed = new Set<string>()
  for (const node of children) {
    const group = groupOf(node)
    if (!group) {
      out.push(node)
      continue
    }
    if (placed.has(group)) continue
    placed.add(group)
    const { open, icon: Icon } = toolGroups[group]
    out.push({
      type: "folder",
      $id: toolGroupId(group, lang),
      name: wordsFor(lang).navigation[group],
      defaultOpen: open,
      icon: <Icon aria-hidden="true" />,
      children: children.filter((child) => groupOf(child) === group),
    })
  }
  return out
}

// Keyed by the section's first page, so one entry covers every language. The value is whether it starts open.
const foldingSections: Record<string, boolean> = {
  prompting: true,
  configuration: false,
  "build-create-cli": false,
  architecture: false,
}

export const sectionFolderId = (id: string) => `section-${id}`

/** A folding section is a folder with no page of its own, so its pages keep their URLs. */
export function withFoldingSections(children: Node[]): Node[] {
  const out: Node[] = []
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    const first = children[i + 1]
    const slug = first?.type === "page" ? first.url.split("/").filter(Boolean).at(-1) : undefined
    const open = node.type === "separator" && slug ? foldingSections[slug] : undefined
    if (open === undefined) {
      out.push(node)
      continue
    }
    const next = children.findIndex((child, at) => at > i && child.type === "separator")
    const end = next < 0 ? children.length : next
    out.push({
      type: "folder",
      $id: sectionFolderId(node.$id ?? String(i)),
      name: node.name ?? "",
      defaultOpen: open,
      children: children.slice(i + 1, end),
    })
    i = end - 1
  }
  return out
}

/** One navigation tree on every page: tool folders expand, never replace the shared menu. */
export function unifiedDocsTree(tree: Root, lang = "en"): Root {
  const decorate = (node: Node): Node => {
    if (node.type === "folder") {
      const Icon = folderIcons[folderTool(node) as keyof typeof folderIcons] ?? FolderOpen
      return {
        ...node,
        root: false,
        defaultOpen: false,
        icon: node.icon ?? <Icon aria-hidden="true" />,
        children: node.children.map(decorate),
      }
    }
    if (node.type !== "page") return node
    const slug = /\/docs\/(tg|max|wa|drive|gcal|mail|memo|zm|b24|pbx)\/?$/.test(node.url)
      ? "index"
      : (node.url.split("/").filter(Boolean).at(-1) ?? "")
    const Icon = sidebarIcons[slug as keyof typeof sidebarIcons] ?? FileText
    const task = /^\/(en|ru|es)\/docs\/(tg|max|wa)\/(usage|rankings|bot|groups)\/?$/.exec(node.url)
    const title = task ? readerGuide([task[2], task[3]], task[1])?.title : undefined
    const page = { ...node, name: title ?? node.name, icon: node.icon ?? <Icon aria-hidden="true" /> }
    const commands = /^\/(en|ru|es)\/docs\/(?:tg|max|wa)\/commands\/?$/.exec(node.url)
    return commands ? commandFolder(page, commands[1]) : page
  }
  const grouped = withToolGroups(withCommunityGroup(tree.children, lang).map(decorate), lang)
  return { ...tree, children: withFoldingSections(grouped) }
}
