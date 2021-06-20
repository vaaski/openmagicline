export * from "./customer"
export * from "./checkin"

export type CurrentLocale = string
export type SupportedLocales = string[]
export interface Success {
  success: "true"
}
export interface GenericError {
  errorMessage: string
  errorCode: string
  args: any[]
  typedArgs: any[]
}

export type ErrorOrSuccess = Partial<Success> & GenericError[]

export interface Permitted {
  databaseId: null | number
  optlock: null | number
  name: string
  prefix: null | string
  type: number
  country: null | string
  colorHex: string
  currencyCode: string
  timeZone: string
  currency: {
    databaseId: null | number
    optlock: null | number
    unit: string
  }
  isTenantWithSingleStudio: boolean
  permitted: boolean
  listChildren: Permitted[]
  permissions: string[]
  isStudioLoginPermitted: boolean
}
export type Notices = any[]
export interface AccountInfo {
  firstname: string
  lastname: string
  fullName: string
  employeeId: number
  imageUrl: {
    url: string
    rewrite: boolean
  }
}
export interface App {
  app: string
  status: string
  values: {
    id?: number
    category: string
    tier?: string
    payment_provider_id?: string
  }
}
