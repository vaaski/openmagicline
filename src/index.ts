import type * as Openmagicline from "../types/openmagicline"

import _got, { Got } from "got"
import once from "lodash/once"
import debug from "debug"

import { currentLocale, supportedLocales } from "./locale"
import { accountInfo, apps, notices, permitted } from "./organization"
import { getCards, removeCard, search } from "./customer"
import { getDefaultUnitID } from "./util"

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

    const httpLog = this.log.extend("http")
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
            let log = `[${response.request.options.method}](${response.statusCode})`
            log += response.url
            if (response.statusCode > 200) log += `\n${response.body}`

            httpLog(log)
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

  util = {
    getDefaultUnitID: getDefaultUnitID.bind(this),
  }

  organization = {
    permitted: permitted.bind(this),
    notices: notices.bind(this),
    accountInfo: accountInfo.bind(this),
    apps: apps.bind(this),
  }

  customer = {
    search: search.bind(this),
    getCards: getCards.bind(this),
    removeCard: removeCard.bind(this),
  }
}
