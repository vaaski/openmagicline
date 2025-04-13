import type { $Fetch } from "ofetch"
import type { Openmagicline as mgl } from "."
import type { Magicline, OMGL } from "../types"

export default class Leads {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	private readonly defaultCreateLeadOptions: Partial<Magicline.Leads.CreateLeadOptions> =
		{
			source: { type: "MANUAL" },
			status: "PENDING",
			customer: {
				firstname: "",
				lastname: "",
				gender: "UNISEX",
				address: { details: {}, country: "DE" },
				placeOfBirth: "",
			},
			tenant: "",
		}

	/**
	 * create a new lead, provide at least customer.firstname and customer.lastname
	 */
	createLead = async (options: Partial<Magicline.Leads.CreateLeadOptions>) => {
		if (options.facilityId === undefined) {
			options.facilityId = await this.mgl.unitID
		}

		return this.fetch<Magicline.Leads.CreateLeadResponse>("/leadmanagement", {
			method: "POST",
			body: {
				...this.defaultCreateLeadOptions,
				...options,
				customer: {
					...this.defaultCreateLeadOptions.customer,
					...options.customer,
				},
			},
		})
	}

	/**
	 * Get all lead campaigns.
	 */
	getCampaigns = async (onlyActive = false, organizationUnitId?: number) => {
		const unitID = organizationUnitId ?? (await this.mgl.unitID)

		return this.fetch<Magicline.Leads.Campaign[]>("/campaign", {
			query: { organizationUnitsIds: unitID, onlyActive },
		})
	}
}
