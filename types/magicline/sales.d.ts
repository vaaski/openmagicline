export type ProductOverview = {
	fkOrganizationUnit: null
	customer: null
	classOfGoodsList: ClassOfGoodsList[]
}

export type ClassOfGoodsList = {
	databaseId: number
	name: string
	materialClassOfGoods: boolean
	voucher: boolean
	productList: ProductList[]
}

export type ProductList = {
	databaseId: number | null
	name: string
	regularTaxRate: TaxRate
	toGoTaxRate: TaxRate | null
	productVariantList: ProductVariantList[]
}

export type ProductVariantList = {
	databaseId: number
	name: string
	itemNumber: string
	currencyUnit: string
	price: number
	additionalInfo: null | string
	stock: number | null
	ean: null | string
}

export type TaxRate = {
	name: string
	percent: number
}
