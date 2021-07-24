import type { Got } from "got/dist/source"
import type mgl from "."

import type * as Responses from "../types/magicline"
import type * as Openmagicline from "../types/openmagicline"

export default class Sales {
  constructor(private got: Got, private mgl: mgl) {}

  async products(
    options?: Openmagicline.Sales.ProductOptions
  ): Promise<Responses.Sales.ProductOverview> {
    const organizationUnitId =
      options?.organizationUnitId ?? (await this.mgl.util.getDefaultUnitID())

    return this.got("sales/productoverview", {
      searchParams: {
        organizationUnitId,
        ...options,
      },
    }).json()
  }
}
