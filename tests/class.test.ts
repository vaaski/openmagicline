import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

test("get classes", async () => {
	const classes = await instance.classes.getClasses()

	expect(classes.length).toBeTruthy()
	expect(classes[0]?.benefit.name).toBeTruthy()
})
