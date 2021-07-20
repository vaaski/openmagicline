export namespace Customer {
  export type CustomerID = number
  export type AccessIdentificationID = number

  export interface Search {
    facility: number
    /**
     * searchInAddress
     * @default false
     */
    searchInAddress?: boolean
    /**
     * searchInBankAccount
     * @default false
     */
    searchInBankAccount?: boolean
    /**
     * searchInCardNumber
     * @default false
     */
    searchInCardNumber?: boolean
    /**
     * searchInCustomerNumber
     * @default false
     */
    searchInCustomerNumber?: boolean
    /**
     * searchInLockerKey
     * @default false
     */
    searchInLockerKey?: boolean
    /**
     * searchInName
     * @default false
     */
    searchInName?: boolean
    /**
     * searchInPurchasedContingentCode
     * @default false
     */
    searchInPurchasedContingentCode?: boolean
    /**
     * showAllFacilities
     * @default false
     */
    showAllFacilities?: boolean
    /**
     * showCheckedIn
     * @default false
     */
    showCheckedIn?: boolean
    /**
     * showOnlyMembers
     * @default false
     */
    showOnlyMembers?: boolean
  }
}
