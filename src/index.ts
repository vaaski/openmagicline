import type { OMGL, unitID } from "../types"

import type { AxiosInstance } from "axios"
import createAuthRefreshInterceptor from "axios-auth-refresh"

import _axios from "axios"
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

/** @deprecated todo: move to util */
export const _log = debug("openmagicline")
export type { OMGL, Magicline, unitID } from "../types"
export class Openmagicline {
  protected log: debug.Debugger
  protected axios: AxiosInstance

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
  constructor(private config: OMGL.Config, axios?: AxiosInstance) {
    this.log = _log.extend(config.gym)

    this.baseUrl = `https://${this.config.gym}.web.magicline.com`
    const prefixUrl = `${this.baseUrl}/rest-api`

    const httpLogger = this.log.extend("http")
    // eslint-disable-next-line unicorn/prefer-ternary
    if (axios) this.axios = axios
    else {
      this.axios = _axios.create({
        baseURL: prefixUrl,
        headers: headers(this),
      })
    }

    this.fetch = ofetch.create({
      baseURL: prefixUrl,
      headers: headers(this),
      onRequest: ({ options }) => {
        if (this.cookies) options.headers.set("cookie", this.cookies)
      },
      onResponse: ({ response, options, request }) => {
        let logPrefix = `[${options.method}](${response.status}) `
        logPrefix += request
        if (response.status > 200) logPrefix += `\n${response._data}`

        httpLogger(logPrefix)
      },
    })

    this.axios.interceptors.request.use(config => {
      if (this.cookies) config.headers.cookie = this.cookies
      return config
    })
    this.axios.interceptors.response.use(response => {
      let log = `[${response.config.method}](${response.status}) `
      log += response.config.url
      if (response.status > 200) log += `\n${response.data}`

      httpLogger(log)
      return response
    })

    createAuthRefreshInterceptor(this.axios, () => {
      console.log("request failed, refreshing token")
      return this.login()
    })

    this.customer = new Customer(this.axios, this)
    this.locale = new Locale(this.fetch)
    this.organization = new Organization(this.fetch, this)
    this.checkin = new Checkin(this.axios, this)
    this.util = new Util(this.fetch, this)
    this.sales = new Sales(this.axios, this)
    this.disposal = this.sales
    this.socket = unitID => new MagicSocket(this, unitID)
  }

  private _login = async (cookies?: string) => {
    if (cookies) {
      this.cookies = cookies
      this.login = once(this._login)

      if (await this.util.testLogin()) {
        return
      } else {
        this.cookies = undefined
        throw new Error("invalid token")
      }
    }

    const { username, password } = this.config
    if (!username || !password) {
      throw new Error("username and password need to be set when cookies aren't provided")
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
