import type { AxiosInstance } from "axios"
import type mgl from "."

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

export default class Sales {
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

  async products(
    options?: Openmagicline.Sales.ProductOptions
  ): Promise<Responses.Sales.ProductOverview> {
    const organizationUnitId =
      options?.organizationUnitId ?? (await this.mgl.util.getDefaultUnitID())

    const { data } = await this.axios("sales/productoverview", {
      params: {
        organizationUnitId,
        ...options,
      },
    })
    return data
  }
}
