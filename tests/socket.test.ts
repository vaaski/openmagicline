import type { Magicline } from "../types"

import { expect, test } from "bun:test"
import { delay, getInstance } from "./_setup"

const instance = await getInstance()

const TEST_CUSTOMER = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0",
)
const TEST_FACILITY = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_FACILITY ?? "0",
)

let checkin: Magicline.Checkin.CheckinResponse
test("checkin event handler fires", async (done) => {
	const socket = await instance.socket(TEST_FACILITY)
	await socket.connected

	socket.onCheckin(async (data) => {
		expect(data.payload.fkCustomer === TEST_CUSTOMER).toBeTrue()
		socket.close()

		await delay()
		await instance.checkin.checkout(checkin.databaseId)
		done()
	})

	checkin = await instance.checkin.checkin({
		fkCustomer: TEST_CUSTOMER,
		requiredOrganizationUnitId: TEST_FACILITY,
	})
})

test.todo(
	"socket subscription doesn't fire after unsubscribing",
	async (done) => {
		// // eslint-disable-next-line no-async-promise-executor
		// const socket = instance.socket(TEST_FACILITY)
		// const unsubscribe = await socket.onCheckin(() => "")
		// unsubscribe()
		// expect(socket.isActive === false).toBeTrue()
		// done()
	},
)

// afterAll(async () => {
// 	try {
// 		await instance.checkin.checkout(checkin.databaseId)
// 	} catch {
// 		// ignore
// 	}
// })
