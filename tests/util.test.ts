import { expect, test } from "bun:test"
import { config, getInstance } from "./_setup"
import { Openmagicline } from "../src"

test("logs in with valid preexisting token", async () => {
	const instance = await getInstance()
	expect(await instance.util.testLogin()).toBeTrue()
})

test("throws with wrong username/password", async () => {
	const instance = new Openmagicline({
		...config,
		username: "wrong",
		password: "wrong",
	})
	expect(instance.login()).rejects.toThrow()
})

test("re-authenticates when passing an invalid token but valid username/password", async () => {
	const instance = new Openmagicline(config)
	const wrongCookies = "wrong"
	instance.cookies = wrongCookies

	const locale = await instance.locale.currentLocale()

	expect(instance.cookies).not.toBe(wrongCookies)
	expect(locale).toBeTruthy()
})

test("get default unitID", async () => {
	const instance = new Openmagicline(config)
	const unitID = await instance.unitID

	expect(typeof unitID === "number").toBeTrue()
})
