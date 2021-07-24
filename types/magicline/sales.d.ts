export namespace Sales {
  export interface ProductOverview {
    fkOrganizationUnit: null
    customer: null
    classOfGoodsList: ClassOfGoodsList[]
  }

  export interface ClassOfGoodsList {
    databaseId: number
    name: string
    materialClassOfGoods: boolean
    voucher: boolean
    productList: ProductList[]
  }

  export interface ProductList {
    databaseId: number | null
    name: string
    regularTaxRate: TaxRate
    toGoTaxRate: TaxRate | null
    productVariantList: ProductVariantList[]
  }

  export interface ProductVariantList {
    databaseId: number
    name: string
    itemNumber: string
    currencyUnit: string
    price: number
    additionalInfo: null | string
    stock: number | null
    ean: null | string
  }

  export interface TaxRate {
    name: string
    percent: number
  }
}
