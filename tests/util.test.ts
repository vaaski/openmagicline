import test from "ava"
import Openmagicline from "../src"
import setup, { config, delay } from "./_setup"

test.beforeEach(delay)

test("logs in with valid preexisting token", async t => {
  const instance = await setup()
  t.true(await instance.util.testLogin())
})

test("throws with wrong username/password", async t => {
  const instance = new Openmagicline({ ...config, username: "wrong", password: "wrong" })
  await t.throwsAsync(instance.login())
})

test("re-authenticates when passing an invalid token but valid username/password", async t => {
  const instance = new Openmagicline(config)
  const wrongCookies = ["wrong"]
  instance.cookies = wrongCookies

  const locale = await instance.locale.currentLocale()

  t.notDeepEqual(instance.cookies, wrongCookies)
  t.truthy(locale)
})
