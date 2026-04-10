import type { OMGL, unitID } from "../types"

import once from "lodash/once"
import debug from "debug"
import { ofetch, type $Fetch } from "ofetch"

import Util, { headers } from "./util"
import Locale from "./locale"
import Organization from "./organization"
import Customer from "./customer"
import Checkin from "./checkin"
import Sales from "./sales"
import MagicSocket from "./socket"
import Leads from "./leads"
import Classes from "./classes"
import Appointments from "./appointments"

export type { OMGL, Magicline, unitID } from "../types"
export class Openmagicline {
	readonly log: debug.Debugger

	private fetch: $Fetch

	public baseUrl: string
	public cookies?: string

	#unitID: unitID | undefined
	get unitID() {
		if (this.#unitID === undefined) {
			const promise = this.util.getDefaultUnitID()

			promise.then((unitID) => {
				this.#unitID = unitID
			})

			return promise
		}

		return this.#unitID
	}

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

	/** everything related to leads/interessenten */
	leads: Leads

	/** everything related to classes */
	classes: Classes

	/** everything related to appointments */
	appointments: Appointments

	/** event handler for magiclines websockets */
	socket: (unitID?: unitID) => Promise<MagicSocket>

	// TODO: check version and warn if openmagicline is outdated
	// TODO: remove default unit id
	// TODO: make a responsedump folder to auto-generate types script
	constructor(readonly config: OMGL.Config) {
		this.log = debug("openmagicline")

		this.baseUrl = `https://${this.config.gym}.web.magicline.com`
		const prefixUrl = `${this.baseUrl}/rest-api`

		const ofetchLogger = this.log.extend("fetch")

		this.fetch = ofetch.create({
			baseURL: prefixUrl,
			referrer: prefixUrl,
			onRequest: ({ options }) => {
				if (this.cookies) options.headers.set("cookie", this.cookies)
				for (const [key, value] of Object.entries(headers(this))) {
					if (!options.headers.has(key)) options.headers.set(key, value)
				}
			},
			onResponse: ({ response, options, request }) => {
				let logString = `[${options.method ?? "GET"}](${response.status}) `

				if (typeof request === "string") {
					logString += request.replace(prefixUrl, "")
				}

				ofetchLogger(logString)
			},
			onResponseError: async (context) => {
				if (context.response.status === 401) {
					this.log("token expired, re-authenticating")
					await this.login()

					context.response = await this.fetch(context.request)
				}
			},
		})

		this.customer = new Customer(this.fetch, this)
		this.locale = new Locale(this.fetch)
		this.organization = new Organization(this.fetch, this)
		this.checkin = new Checkin(this.fetch, this)
		this.util = new Util(this.fetch, this)
		this.sales = new Sales(this.fetch, this)
		this.disposal = this.sales
		this.leads = new Leads(this.fetch, this)
		this.classes = new Classes(this.fetch, this)
		this.appointments = new Appointments(this.fetch, this)
		this.socket = async (unitID) => {
			const _unitID = unitID ?? (await this.unitID)
			return new MagicSocket(this, _unitID)
		}

		this.#unitID = config.unitID
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
