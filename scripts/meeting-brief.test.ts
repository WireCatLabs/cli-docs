import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { expect, it } from "vitest"

it("reproduces the published retrieval evidence in every localized walkthrough", () => {
  const result = JSON.parse(
    execFileSync(process.execPath, ["--experimental-strip-types", "scripts/reproduce-meeting-brief.mjs"], {
      encoding: "utf8",
    }),
  )
  expect(result.matches).toEqual([
    { source: "msg:telegram/demo/301/13", text: "Agreed. I will send the final invoice after the review." },
    { source: "msg:telegram/demo/301/12", text: "Atlas invoice deadline confirmed: Friday, October 9." },
  ])
  expect(result.context).toContainEqual({
    source: "msg:telegram/demo/301/11",
    text: "Tuesday is too early. The client needs time to review.",
  })
  for (const suffix of ["", ".ru", ".es"]) {
    const guide = readFileSync(`content/docs/meeting-brief${suffix}.mdx`, "utf8")
    expect(JSON.parse(guide.match(/```json\n([\s\S]*?)\n```/)?.[1] ?? "null")).toEqual(result)
  }
})
