import type { Magicline } from "../types"

import { expect, test } from "bun:test"
import { getInstance, wait } from "./_setup"

const instance = await getInstance()

const TEST_CUSTOMER = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0",
)
const TEST_FACILITY = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_FACILITY ?? "0",
)

const TEST_KEY_1 = "openmagicline automated test"
const TEST_KEY_2 = "openmagicline automated test 2"

let checkin: Magicline.Checkin.CheckinResponse
let checkinList: Magicline.Checkin.CheckinList

test("check-in a customer", async () => {
	checkin = await instance.checkin.checkin({
		lockerKey: TEST_KEY_1,
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

test("change lockerKey: change key", async () => {
	const changed = await instance.checkin.changeLockerKey(
		checkin.databaseId,
		TEST_KEY_2,
	)

	expect(changed.lockerKey === TEST_KEY_2).toBeTrue()
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

	expect(changedCheckin.lockerKey === TEST_KEY_2).toBeTrue()
})

test("check-out a customer", async () => {
	const checkout = await instance.checkin.checkout(checkin.databaseId)
	expect(checkout.fkCustomer === TEST_CUSTOMER).toBeTrue()
})

test("check-out by customerID", async () => {
	checkin = await instance.checkin.checkin({
		lockerKey: TEST_KEY_1,
		fkCustomer: TEST_CUSTOMER,
	})
	expect(checkin.fkCustomer === TEST_CUSTOMER).toBeTrue()
	expect(checkin.lockerKey === TEST_KEY_1).toBeTrue()

	await wait(500)

	const checkout = await instance.checkin.checkoutByCustomerID(TEST_CUSTOMER)
	expect(checkout.fkCustomer === TEST_CUSTOMER).toBeTrue()
})
