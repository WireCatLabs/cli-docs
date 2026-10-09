import { execFileSync } from "node:child_process"
import { expect, it } from "vitest"

it("reproduces search matches and surrounding context from the isolated meeting fixture", () => {
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
})
