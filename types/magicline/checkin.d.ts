export namespace Checkin {
  export interface CheckinSlot {
    startTime: Date
    endTime: Date
    slotsTotal: number
    slotsReserved: number
    customers: Array<{
      databaseId: number
      optlock: number
      organizationUnitId: number
      customerNumber: string
      firstname: string
      secondFirstname: null
      lastname: string
      secondLastname: null
      dateOfBirth: Date
      gender: number
      customerStatus: number
      imageUrl: null
      usageId: number
    }>
  }
}
