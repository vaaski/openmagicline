export namespace Responses {
  export type CurrentLocale = string
  export type SupportedLocales = string[]

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
}
