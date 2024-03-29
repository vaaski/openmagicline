import type { AxiosInstance } from "axios"
import type { Openmagicline as mgl } from "."

import type { Magicline, OMGL } from "../types"

export default class Sales {
  constructor(private axios: AxiosInstance, private mgl: mgl) {}

  async products(
    options?: OMGL.Sales.ProductOptions
  ): Promise<Magicline.Sales.ProductOverview> {
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
