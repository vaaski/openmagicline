import type { Openmagicline } from "../types/openmagicline"

import _got, { Got } from "got"
import once from "lodash/once"
import debug from "debug"

const _log = debug("openmagicline")

export default class Magicline {
  private got: Got
  private credentials: Openmagicline.Config
  private log: debug.Debugger
  private cookies?: string[]

  loggedIn = false

  constructor(credentials: Openmagicline.Config) {
    this.credentials = credentials
    this.log = _log.extend(credentials.gym)

    const prefixUrl = `https://${this.credentials.gym}.web.magicline.com`
    this.got = _got.extend({
      headers: {
        "user-agent": "openmagicline (https://github.com/vaaski/openmagicline)",
      },
      prefixUrl,
      hooks: {
        beforeRequest: [o => this.log(o.url.href)],
        afterResponse: [
          response => {
            this.log(response.statusCode)
            return response
          },
        ],
      },
    })
  }

  private _login = async () => {
    try {
      const { username, password } = this.credentials
      const response = await this.got.post("login", {
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
}
