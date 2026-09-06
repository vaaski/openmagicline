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
		const [firstChild] = data.listChildren

		if (!firstChild) throw new Error("no children found")

		return firstChild.databaseId ?? DEFAULT_UNIT_ID
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

export const headers = (mgl: mgl) => {
	const u = new URL(mgl.baseUrl)

	const returnValue: HeadersInit = {
		"accept-language": "en-US,en;q=0.6",
		"accept": "application/json, text/javascript, */*; q=0.01",
		"authority": u.hostname,
		"origin": u.origin,
		"referer": u.origin,
		"priority": "u=1, i",
		"sec-ch-ua": "\"Brave\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"macOS\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
		"sec-gpc": "1",
		"x-ml-wc-version": "3.425.25",
		"user-agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
	}

	if (mgl.cookies) returnValue.cookie = mgl.cookies
	return returnValue
}

export const websocketHeaders = (mgl: mgl) => {
	const returnValue: Record<string, string> = {
		"host": `${mgl.config.gym}.web.magicline.com`,
		"connection": "Upgrade",
		"pragma": "no-cache",
		"cache-control": "no-cache",
		"upgrade": "websocket",
		"origin": `https://${mgl.config.gym}.web.magicline.com`,
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
		"accept-encoding": "gzip, deflate, br, zstd",
		"accept-language": "en-US,en;q=0.9,de;q=0.8",
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
