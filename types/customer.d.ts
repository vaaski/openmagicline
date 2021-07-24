import { unitID } from "./openmagicline"

export namespace Customer {
  export type CustomerID = number
  export type AccessIdentificationID = number

  export interface SearchOptions {
    facility: unitID
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
     * @default true
     */
    searchInCustomerNumber?: boolean
    /**
     * searchInLockerKey
     * @default false
     */
    searchInLockerKey?: boolean
    /**
     * searchInName
     * @default true
     */
    searchInName?: boolean
    /**
     * searchInPurchasedContingentCode
     * @default false
     */
    searchInPurchasedContingentCode?: boolean
    /**
     * showAllFacilities
     * @default true
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
