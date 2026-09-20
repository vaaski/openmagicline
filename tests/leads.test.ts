import { expect, test } from "bun:test"
import { getInstance } from "./_setup"

const instance = await getInstance()

test("get lead campaigns", async () => {
	const campaigns = await instance.leads.getCampaigns()

	expect(Array.isArray(campaigns)).toBeTrue()

	if (campaigns.length > 0) {
		expect(campaigns[0]?.databaseId).toBeTruthy()
		expect(campaigns[0]?.name).toBeTruthy()
	}
})
