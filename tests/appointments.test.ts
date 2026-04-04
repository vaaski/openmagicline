import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

test("search appointments", async () => {
	const appointments = await instance.appointments.search()

	expect(appointments.length).toBeTruthy()
	expect(appointments[0]?.databaseId).toBeTruthy()
	expect(appointments[0]?.startDateTime).toBeTruthy()
})

test("search appointments with custom date range", async () => {
	const appointments = await instance.appointments.search({
		startDate: "2026-03-30",
		endDate: "2026-04-05",
	})

	expect(Array.isArray(appointments)).toBeTrue()
})

test("get single appointment", async () => {
	const appointments = await instance.appointments.search()
	const first = appointments[0]

	if (!first) return

	const appointment = await instance.appointments.get(first.databaseId)

	expect(appointment.databaseId).toBe(first.databaseId)
})
