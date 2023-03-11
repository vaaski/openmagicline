export type CallbackFunction<T> = (data: T) => void
export type UnsubscribeFunction = () => void

export interface CheckinEvent {
  type: string
  action: string
  timestamp: number
  tenantName: string
  organizationUnitId: number
  customerIds: unknown[]
  payload: Payload
}

export interface Payload {
  databaseId: number
  optlock: number
  fkOrganizationUnit: number
  fkCustomer: number
  fkEmployee: null
  fkDevice: number
  firstname: string
  lastname: string
  cardNumber: null
  customerNumber: string
  employeeNumber: null
  dateOfBirth: string
  gender: number
  imageUrl: ImageURL | null
  studioName: null
  lockerKey: null | string
  checkinTime: string
  checkoutTime: null | string
  stompDestination: string
}

export interface ImageURL {
  url: string
  rewrite: boolean
}
