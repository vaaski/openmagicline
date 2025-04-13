export type CreateLeadResponse = {
	tenant: string
	facilityId: number
	customer: CreateLeadResponseCustomer
	notes: null
	source: CreateLeadResponseSource
	databaseId: number
	customerId: number
	optlock: number
	employee: null
	status: string
	createdDate: string
	modifiedDate: string
	campaign: null
	newLead: boolean
	lossReasonSelection: null
}

export type CreateLeadResponseCustomer = {
	firstname: string
	secondFirstname: null
	lastname: string
	secondLastname: null
	identityNumber: null
	gender: string
	dateOfBirth: null
	placeOfBirth: null
	countryOfBirth: null
	uuid: string
	email: null
	phone: null
	locale: null
	address: PurpleAddress
}

export type PurpleAddress = {
	street: null
	housenumber: null
	zip: null
	city: null
	country: string
	addition: null
	details: PurpleDetails
}

export type PurpleDetails = {
	additionalInformation: null
	streetType: null
	block: null
	portal: null
	stairway: null
	floor: null
	door: null
	province: null
	provinceCode: null
}

export type CreateLeadResponseSource = {
	type: string
	profileId: null
	campaignId: null
}

export type CreateLeadOptions = {
	facilityId: number
	source: CreateLeadOptionsSource
	status: string
	customer: Partial<CreateLeadOptionsCustomer>
	notes?: string
	tenant: string
	campaign?: Campaign
}

export type Campaign = {
	databaseId: number
	optlock: number
	facilityInfo: FacilityInfo
	externalIdentifier: string
	name: string
	colorHex: string
}

export type FacilityInfo = {
	sharedFacilities: number
	whitelistEntries: WhitelistEntry[]
}

export type WhitelistEntry = {
	facilityId: number
	facilityName: string
	permission: string
	sharable: boolean
	persistable: boolean
}

export type CreateLeadOptionsCustomer = {
	firstname: string
	lastname: string
	gender: string
	address: FluffyAddress
	placeOfBirth: string
}

export type FluffyAddress = {
	details: FluffyDetails
	country: string
}

export type FluffyDetails = unknown

export type CreateLeadOptionsSource = {
	type: string
}
