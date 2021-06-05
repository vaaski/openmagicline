import type { Openmagicline } from "../types/openmagicline"

import _got, { Got } from "got"
import once from "lodash/once"
import debug from "debug"

import { currentLocale, supportedLocales } from "./locale"

const _log = debug("openmagicline")

export default class openmagicline {
  private credentials: Openmagicline.Config
  private cookies?: string[]

  protected baseUrl: string
  protected log: debug.Debugger
  protected got: Got

  public loggedIn = false

  constructor(credentials: Openmagicline.Config) {
    this.credentials = credentials
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

  private _login = async (): Promise<void> => {
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
  }

  login = once(this._login)

  currentLocale = currentLocale
  supportedLocales = supportedLocales
}
