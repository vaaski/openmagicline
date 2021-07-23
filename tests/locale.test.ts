import test, { before, beforeEach } from "ava"
import Openmagicline from "../src"
import setup, { delay } from "./_setup"

let instance: Openmagicline

before(async () => {
  instance = await setup()
})
beforeEach(delay)

test("get supported locales", async t => {
  const data = await instance.locale.supportedLocales()
  t.truthy(data.length)
  t.truthy(typeof data[0] === "string")
})
