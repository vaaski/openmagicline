export namespace Customer {
  export interface SearchedCustomer {
    databaseId: number
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
}
