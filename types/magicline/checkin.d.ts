export type LockerKeyResponse = {
	checkinId: number
	lockerKey: string
}

export type CheckinResponse = {
	/** this is the checkinID **not** the customerID, that is `fkCustomer` */
	databaseId: number
	optlock: number
	fkOrganizationUnit: number
	/** this is the customerID */
	fkCustomer: number
	fkEmployee: null
	fkDevice: number | null
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

export type CheckinList = {
	checkins: Checkin[]
	summary: { [key: string]: number }
}

export type Checkin = {
	databaseId: number
	optlock: null
	customerId: number
	customerOrganizationUnitId: number
	customerFacilityName: string
	lockerKey: null | string
	checkinTime: string
	previousCheckinTime: null | string
	lastCheckoutTime: string
	firstname: string
	lastname: string
	customerNumber: string
	gender: number
	dateOfBirth: null | string
	imageUrl: ImageURL | null
	customerCodes: CustomerCode[]
	contractNames: string[]
	moduleNames: string[]
	badges: Badge[]
	isAnonymized: boolean
}

export type Badge = {
	badge: string
	label: string
}

export type CustomerCode = {
	databaseId: number
	optlock: number
	facilityInfo: null
	name: string
	description: null | string
	colorHex: string
	active: boolean
}

export type ImageURL = {
	url: string
	rewrite: boolean
}
