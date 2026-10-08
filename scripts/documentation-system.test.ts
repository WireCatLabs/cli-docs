import type { CommandInfo } from "@leemour/cli-core/commands"
import { describe, expect, it } from "vitest"
import { diagramStructure, diagramSvg } from "../lib/mermaid"
import { commandSegments, examples, type Program, referenceCoverage, validateInvocation } from "./docs-quality"
import { affectedDocumentationTasks } from "./docs-updates"
import { translationProblems } from "./localize"
import { allowedSource } from "./source-pack"

const leaf = (path: string[], args = 0): CommandInfo => ({
  path,
  name: path.at(-1) ?? "",
  description: "",
  usage: "",
  origin: "handwritten",
  arguments: Array.from({ length: args }, (_, i) => ({
    name: `arg${i}`,
    required: true,
    variadic: false,
    description: "",
  })),
  options: [
    { flags: "--json", takesValue: false, mandatory: false, description: "" },
    { flags: "--limit <n>", takesValue: true, mandatory: false, description: "" },
  ],
  commands: [],
})
const program: Program = {
  cli: "tg",
  globalOptions: [{ flags: "--timeout <duration>", takesValue: true, mandatory: false, description: "" }],
  commands: [{ ...leaf(["messages"]), commands: [leaf(["messages", "send"], 2), leaf(["messages", "list"], 1)] }],
}

describe("released documentation contracts", () => {
  it("maps released guide and dependency changes to potential reader tasks", () => {
    const tasks = [
      { id: "history", pages: ["tg/archive.md"], families: { tg: ["store"] } },
      { id: "login", pages: ["tg/sessions.md"], families: { tg: ["session"] } },
    ]
    expect(affectedDocumentationTasks(["docs/archive.md"], "tg", tasks)).toEqual(["history"])
    expect(affectedDocumentationTasks(["src/commands/store.ts"], "tg", tasks)).toEqual(["history"])
    expect(affectedDocumentationTasks(["src/commands/unknown.ts"], "tg", tasks)).toEqual([])
    expect(affectedDocumentationTasks(["package.json"], "tg", tasks)).toEqual(["history", "login"])
    expect(affectedDocumentationTasks(["src/session/login.ts"], "tg", tasks)).toEqual(["login"])
  })
  it("checks each invocation in pipelines and conditional chains", () => {
    const segments = commandSegments('tg messages list "Book club" | jq . && tg invented')
    expect(segments).toHaveLength(3)
    expect(validateInvocation(segments[0], program, true)).toBeNull()
    expect(validateInvocation(segments[2], program, true)?.kind).toBe("invalid")
  })
  it("accepts profiles, quoted arguments, globals, continuations and redirection", () => {
    expect(
      validateInvocation('tg work --timeout 20s messages send "Book club" "Hi there" --json', program, true),
    ).toBeNull()
    expect(validateInvocation('tg messages list "Book club" --limit 5 2>&1 | jq .', program, true)).toBeNull()
    const extracted = examples('```sh\ntg messages list \\\n  "Book club" --limit 5\n```')
    expect(extracted).toHaveLength(1)
    expect(validateInvocation(extracted[0].text, program, true)).toBeNull()
  })
  it("rejects nonexistent paths, unreleased options and invalid argument/value forms", () => {
    expect(validateInvocation("tg invented --json", program, true)?.kind).toBe("invalid")
    expect(validateInvocation("tg messages invented", program, true)?.kind).toBe("invalid")
    expect(validateInvocation('tg messages list "chat" --planned', program, true)?.kind).toBe("invalid")
    expect(validateInvocation("tg messages send chat", program, true)?.kind).toBe("invalid")
    expect(validateInvocation('tg messages list "chat" --limit', program, true)?.kind).toBe("invalid")
    expect(validateInvocation('tg messages list "chat" --json=true', program, true)?.kind).toBe("invalid")
  })
  it("distinguishes references, placeholders, syntax and unsupported dynamic commands", () => {
    expect(validateInvocation("tg messages send", program, false)).toBeNull()
    expect(validateInvocation('tg messages send <чат> "<текст сообщения>"', program, true)).toBeNull()
    expect(validateInvocation("tg [profile] [options] …", program, true)?.kind).toBe("syntax")
    expect(validateInvocation('tg "$COMMAND"', program, true)?.kind).toBe("unsupported")
  })
  it("reports reference gaps independently from examples", () => {
    const coverage = referenceCoverage("## `tg messages`\n\n### `tg messages list`\n\n--json\n", program)
    expect(coverage.find((item) => item.command === "tg messages send")?.present).toBe(false)
    expect(coverage.find((item) => item.command === "tg messages list")?.missingOptions).toContain("--limit")
    expect(
      referenceCoverage("## `tg messages list`\n--limit-mode --json", program).find(
        (item) => item.command === "tg messages list",
      )?.missingOptions,
    ).toContain("--limit")
  })
})

describe("source packets and diagrams", () => {
  it("filters protected and unrelated files before packing", () => {
    for (const path of [
      ".env",
      "src/.env.local",
      "secrets/token.ts",
      "src/secret.key",
      "config/credentials.yml.enc",
      "docs_ai/report.md",
      "scripts/agent-evals/trace.json",
      "src/../config.ts",
      "src/.hidden/file.ts",
    ])
      expect(allowedSource(path)).toBe(false)
    expect(allowedSource("src/session/login.ts")).toBe(true)
    expect(allowedSource("package.json")).toBe(true)
  })
  it("allows translated labels but rejects changed topology or node shapes", () => {
    const a = 'graph TD\n A["Account"] -->|"reads"| B["Messages"]'
    const b = 'graph TD\n A["Аккаунт"] -->|"читает"| B["Сообщения"]'
    expect(diagramStructure(a)).toBe(diagramStructure(b))
    expect(diagramStructure(a)).not.toBe(diagramStructure(a.replace('B["Messages"]', 'C["Messages"]')))
    expect(diagramStructure(a)).not.toBe(diagramStructure(a.replace('A["Account"]', 'A{"Account"}')))
    expect(translationProblems(`\`\`\`mermaid Caption\n${a}\n\`\`\``, `\`\`\`mermaid Подпись\n${b}\n\`\`\``)).toEqual(
      [],
    )
    expect(translationProblems("```sh\ntg inbox\n```", "```sh\nmax inbox\n```")).toContain("Code blocks changed")
  })
  it("renders without a browser, escapes labels and separates SVG identifiers", () => {
    const chart = 'graph TD\n A["<script>alert(1)</script>"] --> B["Result"]'
    const svg = diagramSvg(chart, "page:1")
    expect(svg).toContain("<svg")
    expect(svg).not.toContain("<script>")
    expect(svg).not.toBe(diagramSvg(chart, "page:2"))
  })
})

it("checks every non-executable shorthand alternative instead of hiding unknown commands", () => {
  const program: Program = {
    cli: "tg",
    globalOptions: [],
    commands: [{ ...leaf(["config"]), commands: [leaf(["config", "show"]), leaf(["config", "set"])] }],
  }
  expect(validateInvocation("tg config show/set", program, false)?.kind).toBe("syntax")
  expect(validateInvocation("tg config show/unknown", program, false)?.kind).toBe("invalid")
  expect(validateInvocation("tg config show/set --unknown", program, false)?.kind).toBe("invalid")
  expect(validateInvocation(commandSegments("tg [profile] resource action")[0], program, true)?.kind).toBe("syntax")
})
