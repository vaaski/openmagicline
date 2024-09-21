import type { OMGL, unitID } from "../types"

import once from "lodash/once"
import debug from "debug"

import Util, { headers } from "./util"
import Locale from "./locale"
import Organization from "./organization"
import Customer from "./customer"
import Checkin from "./checkin"
import Sales from "./sales"
import MagicSocket from "./socket"
import { ofetch, type $Fetch } from "ofetch"

export type { OMGL, Magicline, unitID } from "../types"
export class Openmagicline {
	readonly log: debug.Debugger

	private fetch: $Fetch

	public baseUrl: string
	public cookies?: string

	customer: Customer

	/** get locale information */
	locale: Locale

	/** get organization information */
	organization: Organization

	/** everything related to the checkin process */
	checkin: Checkin

	/** miscellaneous helpers and thingies */
	util: Util

	/** everything related to retail sales (magicline calls this disposal in some places) */
	sales: Sales

	/** reference to this.sales */
	disposal: Sales

	/** event handler for magiclines websockets */
	socket: (unitID: unitID) => MagicSocket

	// TODO: check version and warn if openmagicline is outdated
	constructor(private config: OMGL.Config) {
		this.log = debug("openmagicline")

		this.baseUrl = `https://${this.config.gym}.web.magicline.com`
		const prefixUrl = `${this.baseUrl}/rest-api`

		const ofetchLogger = this.log.extend("fetch")

		this.fetch = ofetch.create({
			baseURL: prefixUrl,
			headers: headers(this),
			referrer: prefixUrl,
			onRequest: ({ options }) => {
				if (this.cookies) options.headers.set("cookie", this.cookies)
			},
			onResponse: ({ response, options, request }) => {
				let logString = `[${options.method ?? "GET"}](${response.status}) `

				if (typeof request === "string") {
					logString += request.replace(prefixUrl, "")
				}

				ofetchLogger(logString)
			},
		})

		// todo: recreate this
		// createAuthRefreshInterceptor(this.axios, () => {
		//   console.log("request failed, refreshing token")
		//   return this.login()
		// })

		this.customer = new Customer(this.fetch, this)
		this.locale = new Locale(this.fetch)
		this.organization = new Organization(this.fetch, this)
		this.checkin = new Checkin(this.fetch, this)
		this.util = new Util(this.fetch, this)
		this.sales = new Sales(this.fetch, this)
		this.disposal = this.sales
		this.socket = (unitID) => new MagicSocket(this, unitID)
	}

	private _login = async (cookies?: string) => {
		if (cookies) {
			this.cookies = cookies
			this.login = once(this._login)

			if (await this.util.testLogin()) return

			this.cookies = undefined
			throw new Error("invalid token")
		}

		const { username, password } = this.config
		if (!username || !password) {
			throw new Error(
				"username and password need to be set when cookies aren't provided",
			)
		}

		const response = await ofetch.raw("/login", {
			method: "POST",
			query: { username, password, client: "webclient" },
			baseURL: this.baseUrl,
		})

		this.login = once(this._login)

		const newCookies = response.headers.get("set-cookie")
		if (!newCookies) throw new Error("no login cookies returned")

		this.cookies = newCookies
	}

	/**
	 * authenticate the Openmagicline instance using username/password from the instance config.
	 *
	 * if a token is passed, it will be validated and the request to `/login` will be skipped.
	 * @param cookies existing cookies, available after login at `.cookies`
	 * @returns instance for chaining
	 * @throws when not authenticated
	 */
	login = once(this._login)
}
