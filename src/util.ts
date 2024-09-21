import type { $Fetch } from "ofetch"

import type { Openmagicline as mgl } from "."
import type { unitID } from "../types"

import FormData from "form-data"
import { DEFAULT_UNIT_ID } from "./constants"

export default class Util {
	constructor(
		private fetch: $Fetch,
		private mgl: mgl,
	) {}

	async getDefaultUnitID(): Promise<unitID> {
		const data = await this.mgl.organization.permitted()

		return data.listChildren[0].databaseId ?? DEFAULT_UNIT_ID
	}

	/**
	 * check if the login token works.
	 */
	async testLogin(): Promise<boolean> {
		try {
			await this.mgl.locale.currentLocale()
			return true
		} catch {
			return false
		}
	}
}

export const headers = (mgl: mgl): HeadersInit => {
	const u = new URL(mgl.baseUrl)

	// prettier-ignore
	const returnValue: HeadersInit = {
		"accept-language": "en-US,en;q=0.5",
		accept: "application/json, text/javascript, */*; q=0.01",
		authority: u.hostname,
		origin: u.href,
		priority: "u=1, i",
		referer: u.href,
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": '"macOS"',
		"sec-ch-ua": '"Brave";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
		"sec-gpc": "1",
		"x-ml-wc-version": "3.399.7",
		"x-requested-with": "XMLHttpRequest",
	}

	if (mgl.cookies) returnValue.cookie = mgl.cookies
	return returnValue
}

export const websocketHeaders = (mgl: mgl) => {
	const u = new URL(mgl.baseUrl)

	const returnValue: Record<string, string> = {
		Pragma: "no-cache",
		Origin: u.href,
		"Accept-Language":
			"en-CA,en-US;q=0.9,en;q=0.8,de-DE;q=0.7,de;q=0.6,en-GB;q=0.5",
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
		"Cache-Control": "no-cache",
	}

	if (mgl.cookies) returnValue.cookie = mgl.cookies
	return returnValue
}

export const formData = (data: Record<string, string>): FormData => {
	const form = new FormData()
	for (const [key, value] of Object.entries(data)) form.append(key, value)
	return form
}

export const searchParameters = (
	data: Record<string, string>,
): URLSearchParams => {
	const parameters = new URLSearchParams()
	for (const [key, value] of Object.entries(data)) parameters.set(key, value)
	return parameters
}
