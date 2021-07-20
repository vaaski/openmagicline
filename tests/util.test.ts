import test from "ava"
import Openmagicline from "../src"
import { config } from "./setup"

test("test for invalid login", async t => {
  const instance = new Openmagicline(config)
  await t.throwsAsync(instance.login([]))
})
