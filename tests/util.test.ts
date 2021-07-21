import test from "ava"
import Openmagicline from "../src"
import setup, { config } from "./setup"

test("throws with invalid preexisting token", async t => {
  const instance = new Openmagicline(config)
  await t.throwsAsync(instance.login([]))
})

test("logs in with valid preexisting token", async t => {
  const instance = await setup()
  t.true(await instance.util.testLogin())
})

test("throws with wrong username/password", async t => {
  const instance = new Openmagicline({ ...config, password: "wrong" })
  await t.throwsAsync(instance.login())
})
