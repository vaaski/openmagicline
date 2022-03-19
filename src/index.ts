import type * as OMGL from "../types/openmagicline"
import type * as Magicline from "../types/magicline/index"
import type { AxiosInstance } from "axios"

export { OMGL, Magicline }

import _axios from "axios"
import once from "lodash/once"
import debug from "debug"

import Util, { headers, searchParams } from "./util"
import Locale from "./locale"
import Organization from "./organization"
import Customer from "./customer"
import Checkin from "./checkin"
import Sales from "./sales"
import MagicSocket from "./socket"

export const _log = debug("openmagicline")

export default class Openmagicline {
  protected log: debug.Debugger
  protected axios: AxiosInstance

  public baseUrl: string
  public cookies?: string[]

  customer: Customer
  locale: Locale
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
  socket: (unitID: OMGL.unitID) => MagicSocket

  // TODO: check version and warn if openmagicline is outdated
  constructor(private config: OMGL.Config, axios?: AxiosInstance) {
    this.log = _log.extend(config.gym)

    this.baseUrl = `https://${this.config.gym}.web.magicline.com`
    const prefixUrl = `${this.baseUrl}/rest-api`

    const httpAxiosLog = this.log.extend("http")
    if (axios) this.axios = axios
    else {
      this.axios = _axios.create({
        baseURL: prefixUrl,
        headers: headers(this),
      })
    }

    this.axios.interceptors.request.use(config => {
      if (this.cookies) config.headers.cookie = this.cookies
      return config
    })
    this.axios.interceptors.response.use(response => {
      let log = `[${response.config.method}](${response.status}) `
      log += response.config.url
      if (response.status > 200) log += `\n${response.data}`

      httpAxiosLog(log)
      return response
    })

    this.customer = new Customer(this.axios)
    this.locale = new Locale(this.axios)
    this.organization = new Organization(this.axios, this)
    this.checkin = new Checkin(this.axios, this)
    this.util = new Util(this.axios, this)
    this.sales = new Sales(this.axios, this)
    this.disposal = this.sales
    this.socket = unitID => new MagicSocket(this, unitID)
  }

  private _login = async (cookies?: string[]): Promise<Openmagicline> => {
    if (cookies) {
      this.cookies = cookies
      this.login = once(this._login)

      if (await this.util.testLogin()) {
        return this
      } else {
        this.cookies = undefined
        throw Error("invalid token")
      }
    }

    try {
      const { username, password } = this.config
      if (!username || !password)
        throw Error("username and password need to be set when cookies aren't provided")

      const response = await this.axios.post(
        "login",
        searchParams({ username, password, client: "webclient" }),
        { baseURL: this.baseUrl }
      )

      this.login = once(this._login)

      this.cookies = response.headers["set-cookie"]
    } catch (err: any) {
      this.cookies = undefined

      if (err?.response?.data) throw err.response.data
      throw err
    }

    return this
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
