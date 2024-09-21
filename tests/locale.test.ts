import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

test("get supported locales", async () => {
	const data = await instance.locale.supportedLocales()

	expect(data.length).toBePositive()
	expect(typeof data[0] === "string").toBeTrue()
})
