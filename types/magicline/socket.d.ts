export type Checkin = {
	type: string
	action: string
	timestamp: number
	tenantName: string
	organizationUnitId: number
	customerIds: unknown[]
	payload: CheckinPayload
}

export type CheckinPayload = {
	databaseId: number
	optlock: number
	fkOrganizationUnit: number
	fkCustomer: number
	fkEmployee: null
	fkDevice: null
	firstname: string
	lastname: string
	cardNumber: null
	customerNumber: string
	employeeNumber: null
	dateOfBirth: string
	gender: number
	imageUrl: null
	studioName: null
	lockerKey: null | string
	checkinTime: string
	checkoutTime: null | string
	stompDestination: string
}

export type CheckinRequest = {
	type: string
	action: string
	timestamp: number
	tenantName: string
	organizationUnitId: number
	customerIds: unknown[]
	payload: CheckinRequestPayload
}

export type CheckinRequestPayload = {
	deviceId: number
	customer: Customer
	stompDestination: string
}

export type Customer = {
	checkinId: number
	checkoutTime: string
	databaseId: number
	organizationUnit: number
	facilityName: string
	customerNumber: string
	cardNumber: string
	firstname: string
	secondFirstname: null
	lastname: string
	secondLastname: null
	taxId: null
	telPrivate: string
	telPrivateMobile: null
	telBusiness: null
	telBusinessMobile: null
	email: null
	emailStatusType: null
	street: string
	houseNumber: string
	zip: string
	city: string
	dateOfBirth: string
	underage: boolean
	gender: number
	customerStatus: number
	textMessageStatus: string
	textMessageNumber: string
	lockerKey: null
	lastCheckIn: string
	imageUrl: null
	isAnonymized: boolean
	emailVerificationStatus: null
	noExcuseState: null
	addressStatus: null
	addressToLegalRepresentative: boolean
	checkedIn: boolean
}
