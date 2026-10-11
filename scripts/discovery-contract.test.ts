import { expect, it } from "vitest"
import { discoveryContract } from "./discovery-contract"

it("captures root options from the released Zoom discovery shape without altering the response", () => {
  const raw = {
    commands: [],
    options: [{ flags: "--json", description: "one JSON value", takesValue: false, mandatory: false }],
  }
  expect(discoveryContract(raw, "zm")).toEqual({ cli: "zm", commands: [], globalOptions: raw.options })
  expect(raw).not.toHaveProperty("cli")
})
it("keeps the older explicit discovery interface", () => {
  expect(discoveryContract({ cli: "tg", commands: [], globalOptions: [] }, "tg")).toEqual({
    cli: "tg",
    commands: [],
    globalOptions: [],
  })
})
it("refuses a different executable or missing command/options data", () => {
  for (const raw of [null, {}, { cli: "max", commands: [], options: [] }, { commands: [] }])
    expect(() => discoveryContract(raw, "zm")).toThrow("Invalid discovery contract")
})
