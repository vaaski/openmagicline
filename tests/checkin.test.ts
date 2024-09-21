import type { Magicline } from "../types"

import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

const TEST_CUSTOMER = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0",
)
const TEST_FACILITY = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_FACILITY ?? "0",
)

let checkin: Magicline.Checkin.CheckinResponse
let checkinList: Magicline.Checkin.CheckinList

test("check-in a customer", async () => {
	checkin = await instance.checkin.checkin({
		lockerKey: "openmagicline automated test",
		fkCustomer: TEST_CUSTOMER,
	})
	expect(checkin.fkCustomer === TEST_CUSTOMER).toBeTrue()
})

test("get checkin list", async () => {
	checkinList = await instance.checkin.list()
	expect(Array.isArray(checkinList.checkins)).toBeTrue()
	expect(checkinList.checkins[0].firstname).toBeTruthy()
	expect(typeof checkinList.checkins[0].databaseId === "number").toBeTrue()
})

const changedTo = "openmagicline automated test 2"
test("change lockerKey: change key", async () => {
	const changed = await instance.checkin.changeLockerKey(
		checkin.databaseId,
		changedTo,
	)

	expect(changed.lockerKey === changedTo).toBeTrue()
	expect(changed.checkinId === checkin.databaseId).toBeTrue()
})

test("get checkin list with a unitID", async () => {
	checkinList = await instance.checkin.list({
		organizationUnitId: TEST_FACILITY,
	})
	expect(Array.isArray(checkinList.checkins)).toBeTrue()
	expect(checkinList.checkins[0].firstname).toBeTruthy()
	expect(typeof checkinList.checkins[0].databaseId === "number").toBeTrue()
})

test("change lockerKey: check key", async () => {
	const changedCheckin = checkinList.checkins.find(
		(c) => c.databaseId === checkin.databaseId,
	)
	if (!changedCheckin) throw "can't find lockerkey-changed checkin anymore"

	expect(changedCheckin.lockerKey === changedTo).toBeTrue()
})

test("check-out a customer", async () => {
	const checkout = await instance.checkin.checkout(checkin.databaseId)
	expect(checkout.fkCustomer === TEST_CUSTOMER).toBeTrue()
})
