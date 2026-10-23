import { expect, it } from "vitest"
import { discoveryContract } from "./discovery-contract"

it("captures root options from the released Zoom discovery shape without altering the response", () => {
  const raw = {
    commands: [],
    options: [{ flags: "--json", description: "one JSON value", takesValue: false, mandatory: false }],
  }
  expect(discoveryContract(raw, "zm")).toEqual({
    cli: "zm",
    commands: [],
    globalOptions: [{ flags: "--json", description: "one JSON value", takes_value: false, mandatory: false }],
  })
  expect(raw).not.toHaveProperty("cli")
})
it("keeps the older explicit discovery interface", () => {
  expect(discoveryContract({ cli: "tg", commands: [], globalOptions: [] }, "tg")).toEqual({
    cli: "tg",
    commands: [],
    globalOptions: [],
  })
})
it("reads the snake_case shape of cli-base 0.25 and later", () => {
  const options = [{ flags: "--json", description: "", takes_value: false, mandatory: false }]
  expect(discoveryContract({ commands: [], global_options: options }, "tg").globalOptions).toEqual(options)
})
it("refuses a different executable or missing command/options data", () => {
  for (const raw of [null, {}, { cli: "max", commands: [], options: [] }, { commands: [] }])
    expect(() => discoveryContract(raw, "zm")).toThrow("Invalid discovery contract")
})
it("marks a release whose first word is the profile", () => {
  const usage = (text: string) => ({ path: ["chats"], usage: text, options: [], commands: [] })
  const described = {
    description: "The first word is the profile whenever it is not a command",
    commands: [],
    options: [],
  }
  expect(discoveryContract(described, "zm").profile).toBe(true)
  expect(discoveryContract({ commands: [usage("drive <profile> folders")], options: [] }, "drive").profile).toBe(true)
  expect(discoveryContract({ commands: [usage("tg chats")], options: [] }, "tg")).not.toHaveProperty("profile")
})
