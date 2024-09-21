import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

test("get permitted", async () => {
	const data = await instance.organization.permitted()
	expect(data).toBeTruthy()
})

test("get accountInfo", async () => {
	const data = await instance.organization.accountInfo()
	expect(data).toBeTruthy()
})

test("get apps", async () => {
	const data = await instance.organization.apps()
	expect(data).toBeTruthy()
})

test("get apps for specific unitID", async () => {
	const unitID = await instance.util.getDefaultUnitID()
	const data = await instance.organization.apps(unitID)
	expect(data).toBeTruthy()
})
