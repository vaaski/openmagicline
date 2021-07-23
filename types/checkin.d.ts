export namespace Checkin {
  export interface ListOptions {
    organizationUnitId?: number
    offset?: number
    maxResults?: number
    search?: string
    filter?: string
    sortedby?: "checkinTime" | "checkinDuration" | "lastname" | "firstname" | "lockerKey"
    checkouts?: boolean
    direction?: "DESCENDING" | "ASCENDING"
  }

  export interface CheckinOptions {
    /** not sure what this is for */
    customerCardNumber?: null | any
    /** not sure what this is for */
    customerUUID?: string
    /** customerID */
    fkCustomer: number
    /** not sure what this is for */
    fkDevice?: null | any
    /** organizationUnitId */
    fkOrganizationUnit?: number
    /** not sure what this is for */
    lockerKey: number | string
    /** not sure what this is for */
    purchasedContingentCode?: null | any
    /** not sure what this is for */
    databaseId?: null | any
    /** not sure what this is for, was 0 for me */
    optlock?: number
    /** organizationUnitId */
    requiredOrganizationUnitId?: number
  }
}
