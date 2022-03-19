import type { unitID } from "./openmagicline"

export namespace Sales {
  export interface ProductOptions {
    organizationUnitId?: unitID
    customerId?: number
  }
}
