import type { $Fetch } from "ofetch"

import type { Magicline } from "../types"

export default class Locale {
	constructor(private fetch: $Fetch) {}

	async currentLocale() {
		return await this.fetch<Magicline.CurrentLocale>("/currentLocale")
	}

	async supportedLocales() {
		return await this.fetch<Magicline.SupportedLocales>("/supportedLocales")
	}
}
