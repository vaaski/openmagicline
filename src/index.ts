import type * as Openmagicline from "$/openmagicline"

import _got, { Got } from "got"
import once from "lodash/once"
import debug from "debug"

import { currentLocale, supportedLocales } from "./locale"
import { accountInfo, apps, notices, permitted } from "./organization"
import { search } from "./customer"
import { getSlots } from "./checkin"

const _log = debug("openmagicline")

export default class openmagicline {
  private cookies?: string[]

  protected baseUrl: string
  protected log: debug.Debugger
  protected got: Got

  public loggedIn = false

  constructor(private credentials: Openmagicline.Config) {
    this.log = _log.extend(credentials.gym)

    this.baseUrl = `https://${this.credentials.gym}.web.magicline.com`
    const prefixUrl = `${this.baseUrl}/rest-api`

    this.got = _got.extend({
      headers: {
        "user-agent": "openmagicline (https://github.com/vaaski/openmagicline)",
        cookies: this.cookies,
      },
      prefixUrl,
      hooks: {
        beforeRequest: [
          options => {
            if (this.cookies) options.headers.cookie = this.cookies
          },
        ],
        afterResponse: [
          response => {
            this.log(`[${response.statusCode}] ${response.url}`)
            return response
          },
        ],
      },
    })
  }

  private _login = async (): Promise<boolean> => {
    try {
      const { username, password } = this.credentials
      const response = await this.got.post("login", {
        prefixUrl: this.baseUrl,
        form: { username, password, client: "webclient" },
      })

      this.login = once(this._login)

      this.loggedIn = true
      this.cookies = response.headers["set-cookie"]
    } catch (err) {
      this.loggedIn = false
      this.cookies = undefined
    }

    return this.loggedIn
  }

  login = once(this._login)

  currentLocale = currentLocale
  supportedLocales = supportedLocales

  organization = {
    permitted: permitted.bind(this),
    notices: notices.bind(this),
    accountInfo: accountInfo.bind(this),
    apps: apps.bind(this),
  }

  customer = {
    search: search.bind(this),
  }

  checkin = {
    slots: getSlots.bind(this),
  }
}
