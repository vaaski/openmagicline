import test, { before } from "ava"
import Openmagicline from "../src"
import setup from "./setup"

let instance: Openmagicline

before(async () => {
  instance = await setup()
})

test("get supported locales", async t => {
  const data = await instance.locale.supportedLocales()
  t.truthy(data.length)
  t.truthy(typeof data[0] === "string")
})
