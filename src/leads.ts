import type { $Fetch } from "ofetch"
import type { Openmagicline as mgl } from "."
import type { Magicline } from "../types"

export default class Leads {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	private readonly defaultCreateLeadOptions: Partial<Magicline.Leads.CreateLeadOptions> = {
		identityCardProvided: true,
		masterData: {
			customerTitle: 0,
			note: "",
			telPrivate: "",
			telBusiness: "",
			telPrivateMobile: "",
			telBusinessMobile: "",
			firstname: "",
			identityCardProvided: false,
			gender: 0,
			dateOfBirth: "",
			lastname: "",
			email: "",
			info: "",
			birthInformation: {
				dateOfBirth: "",
				placeOfBirth: "",
				databaseId: null,
				optlock: 0,
			},
			medicalCertificate: {
				certificateStatus: "",
				status: null,
				databaseId: null,
				optlock: 0,
			},
			sportFederationCertificate: {
				sportFederation: null,
				databaseId: null,
				optlock: 0,
				status: null,
			},
			secondFirstname: "",
			secondLastname: "",
			fax: "",
			documentIdentification: {
				documentNumber: "",
			},
		},
		voucher: {
			optlock: 0,
		},
		address: {
			optlock: 0,
			addition: "",
			city: "",
			street: "",
			houseNumber: "",
			zip: "",
			country: "",
			details: {
				additionalInformation: "",
				block: "",
				door: "",
				floor: "",
				portal: "",
				province: "",
				stairway: "",
				streetType: "",
				secondStreet: "",
				provinceCode: "",
				buildingName: "",
				cityPart: "",
				district: "",
			},
		},
		listCustomerTagFks: [],
		fkOrganizationUnit: 0,
		cardNumber: "",
		image: {
			imageUrl: "",
			type: "CUSTOMER",
			isPlaceholder: true,
		},
	}

	/**
	 * create a new lead, provide at least customer.firstname and customer.lastname
	 */
	createLead = async (options: Partial<Magicline.Leads.CreateLeadOptions>) => {
		if (options.fkOrganizationUnit === undefined) {
			options.fkOrganizationUnit = await this.mgl.unitID
		}

		return this.fetch<Magicline.Leads.CreateLeadResponse>("/customer/prospect/create", {
			method: "POST",
			body: {
				...this.defaultCreateLeadOptions,
				...options,
				customer: {
					...this.defaultCreateLeadOptions.masterData,
					...options.masterData,
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
