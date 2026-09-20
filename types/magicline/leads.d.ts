export type CreateLeadResponse = {
	databaseId: number
	fkOrganizationUnit: number
	masterData: CreateLeadResponseMasterData
	address: CreateLeadResponseAddress
	bankAccount: null
	listCustomerTagFks: number[]
	paymentMethod: number
	uuid: string
	creditCard: null
	campaignId: null
	payer: null
	grantSepaMandate: null
	customerNumber: string
	fkBasedOnMember: null
}

export type CreateLeadResponseAddress = {
	databaseId: number
	optlock: number
	street: string
	houseNumber: string
	zip: string
	city: string
	country: string
	addition: string
	details: Details
	studioCountryCode: null
	status: Status
	addressInquiryStatus: null
	streetLine: string
	cityLine: null
}

export type Details = {
	additionalInformation: null | string
	streetType: null | string
	block: null | string
	portal: null | string
	stairway: null | string
	floor: null | string
	door: null | string
	province: null | string
	provinceCode: null | string
	secondStreet: null | string
	buildingName: null | string
	cityPart: null | string
	district: null | string
}

export type Status = {
	type: string
	statusInformation: null
	since: null
}

export type CreateLeadResponseMasterData = {
	firstname: string
	secondFirstname: null
	lastname: string
	secondLastname: null
	taxId: null
	documentIdentification: PurpleDocumentIdentification
	gender: number
	customerTitle: number
	birthInformation: PurpleBirthInformation
	customerStatus: number
	telPrivate: string
	telPrivateMobile: string
	telBusiness: string
	telBusinessMobile: string
	email: string
	emailStatusType: string
	emailStatusInfo: string
	locale: string
	textMessageStatusType: string
	textMessageStatusInfo: string
	textMessageNumber: string
	note: null
	noExcuseState: string
	emailVerificationStatus: string
	campaignId: null
	medicalCertificate: MedicalCertificate
	sportFederationCertificate: null
	studioCountryCode: null
	dateOfBirth: string
}

export type PurpleBirthInformation = {
	dateOfBirth: string
	placeOfBirth: null
	countryOfBirth: null
}

export type PurpleDocumentIdentification = {
	documentNumber: null
	documentType: null
}

export type MedicalCertificate = {
	expirationDate: null
	status: null
	certificateStatus: null
}

export type Campaign = {
	databaseId: number
	optlock: number
	facilityInfo: FacilityInfo
	externalIdentifier: string
	name: string
	description: null | string
	colorHex: string
	timePeriodDto: TimePeriodDto | null
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

export type TimePeriodDto = {
	startDate: string
	endDate: string
}

export type CreateLeadOptions = {
	identityCardProvided: boolean
	masterData: CreateLeadOptionsMasterData
	voucher: Voucher
	address: CreateLeadOptionsAddress
	listCustomerTagFks: number[]
	fkOrganizationUnit: number
	cardNumber: string
	image: Image
}

export type CreateLeadOptionsAddress = {
	optlock: number
	addition: string
	city: string
	street: string
	houseNumber: string
	zip: string
	country: string
	details: Details
}

export type Image = {
	imageUrl: string
	type: string
	isPlaceholder: boolean
}

export type CreateLeadOptionsMasterData = {
	customerTitle: number
	note: string
	telPrivate: string
	telBusiness: string
	telPrivateMobile: string
	telBusinessMobile: string
	firstname: string
	identityCardProvided: boolean
	gender: number
	dateOfBirth: string
	lastname: string
	email: string
	info: string
	birthInformation: FluffyBirthInformation
	medicalCertificate: Certificate
	sportFederationCertificate: Certificate
	secondFirstname: string
	secondLastname: string
	fax: string
	documentIdentification: FluffyDocumentIdentification
}

export type FluffyBirthInformation = {
	dateOfBirth: string
	placeOfBirth: string
	databaseId: null
	optlock: number
}

export type FluffyDocumentIdentification = {
	documentNumber: string
}

export type Certificate = {
	certificateStatus?: string
	status: null
	databaseId: null
	optlock: number
	sportFederation?: null
}

export type Voucher = {
	optlock: number
}
