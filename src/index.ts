import type * as OMGL from "../types/openmagicline"
import type * as Magicline from "../types/magicline/index"
export { OMGL, Magicline }

import _got, { Got } from "got"
import once from "lodash/once"
import debug from "debug"

import Util, { headers } from "./util"
import Locale from "./locale"
import Organization from "./organization"
import Customer from "./customer"
import Checkin from "./checkin"
import Sales from "./sales"
import MagicSocket from "./socket"

export const _log = debug("openmagicline")

export default class Openmagicline {
  protected log: debug.Debugger
  protected got: Got

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
  constructor(private config: OMGL.Config) {
    this.log = _log.extend(config.gym)

    this.baseUrl = `https://${this.config.gym}.web.magicline.com`
    const prefixUrl = `${this.baseUrl}/rest-api`

    const httpLog = this.log.extend("http")
    this.got = _got.extend({
      headers: headers(this),
      prefixUrl,
      hooks: {
        beforeRequest: [
          options => {
            if (this.cookies) options.headers.cookie = this.cookies
          },
        ],
        afterResponse: [
          response => {
            let log = `[${response.request.options.method}](${response.statusCode})`
            log += response.url
            if (response.statusCode > 200) log += `\n${response.body}`

            httpLog(log)
            return response
          },
        ],
      },
    })

    this.customer = new Customer(this.got)
    this.locale = new Locale(this.got)
    this.organization = new Organization(this.got, this)
    this.checkin = new Checkin(this.got, this)
    this.util = new Util(this.got, this)
    this.sales = new Sales(this.got, this)
    this.disposal = this.sales
    this.socket = unitID => new MagicSocket(this, unitID)
  }

  /**
   * authenticate the Openmagicline instance using username/password from the instance config.
   *
   * if a token is passed, it will be validated and the request to `/login` will be skipped.
   * @param cookies existing cookies, available after login at `.cookies`
   * @returns instance for chaining
   * @throws when not authenticated
   */
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
      const response = await this.got.post("login", {
        prefixUrl: this.baseUrl,
        form: { username, password, client: "webclient" },
      })

      this.login = once(this._login)

      this.cookies = response.headers["set-cookie"]
    } catch (err) {
      this.cookies = undefined
      throw err
    }

    return this
  }

  login = once(this._login)
}
