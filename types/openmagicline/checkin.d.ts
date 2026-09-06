import type { unitID } from ".."

export type ListOptions = {
	organizationUnitId: unitID
	offset: number
	/** magiclines webclient sets this to  */
	maxResults: number
	search: string
	filter: string
	sortedby:
		| "checkinTime"
		| "checkinDuration"
		| "lastname"
		| "firstname"
		| "lockerKey"
	/** list checkouts instead */
	checkouts: boolean
	direction: "DESCENDING" | "ASCENDING"
}

export type CheckinOptions = {
	/** not sure what this is for */
	customerCardNumber: null | unknown
	/** not sure what this is for */
	customerUUID: string
	/** customerID */
	fkCustomer: number
	/** not sure what this is for */
	fkDevice: null | unknown
	/** organizationUnitId */
	fkOrganizationUnit: unitID
	lockerKey: number | string
	/** not sure what this is for */
	purchasedContingentCode: null | unknown
	/** not sure what this is for */
	databaseId: null | unknown
	/** not sure what this is for, was 0 for me */
	optlock: number
	/** organizationUnitId */
	requiredOrganizationUnitId: unitID
}

export type CheckoutOptions = {
	optLockRemote?: number
}

export type LockerKeyOptions = {
	/** not sure what this is for */
	databaseId?: null | unknown
	/** not sure what this is for */
	optlock?: 0 | number
}
