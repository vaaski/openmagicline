import type { Magicline } from "../types"

import { expect, test, afterAll } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

const TEST_CUSTOMER = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_CUSTOMER ?? "0",
)
const TEST_FACILITY = Number.parseInt(
	process.env.OPENMAGICLINE_TEST_FACILITY ?? "0",
)

let checkin: Magicline.Checkin.CheckinResponse

test.todo("checkin event handler fires", async (done) => {
	// const socket = instance.socket(TEST_FACILITY)
	// console.log("before socket.onCheckin")
	// await socket.onCheckin((data) => {
	// 	expect(data.payload.fkCustomer === TEST_CUSTOMER).toBeTrue()
	// 	socket.unsubscribeAll()
	// 	socket.deactivate()
	// 	done()
	// })
	// console.log("after socket.onCheckin")
	// // checks if already active returns instantly
	// await socket.activate()
	// console.log("checking in")
	// checkin = await instance.checkin.checkin({
	// 	fkCustomer: TEST_CUSTOMER,
	// 	requiredOrganizationUnitId: TEST_FACILITY,
	// })
})

test.todo(
	"socket unsubscribing deactivates the connection automatically",
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
