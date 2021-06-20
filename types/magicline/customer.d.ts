import type * as Openmagicline from "../types/openmagicline"

export namespace Customer {
  export interface Base {
    databaseId: Openmagicline.Customer.CustomerID
  }

  export interface SearchedCustomer extends Base {
    firstname: string
    lastname: string
    gender: number
    dateOfBirth: Date | null
    lastCheckIn: Date | null
    facilityName: string
    customerNumber: string
    cardNumber: null
    lockerKey: null | string
    customerStatus: number
    purchasedContingentCode: null
    purchasedContingentType: null
    imageUrl: null
    checkedIn: boolean
    street: null | string
    houseNumber: null | string
    zip: null | string
    city: null | string
  }

  export interface AccessIdentification {
    databaseId: Openmagicline.Customer.AccessIdentificationID
    optlock: number
    fkOrganizationUnit: number
    createdDate: Date
    type: string
    uid: string
    stompDestination: string
  }
}
