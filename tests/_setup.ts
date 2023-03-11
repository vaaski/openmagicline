import { join, dirname } from "node:path"
import { read, write } from "fs-jetpack"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

import { Openmagicline } from "../src"

const tokenPath = join(__dirname, "../token.json")

const readToken = (): string[] => read(tokenPath, "json")
const saveToken = (token: string[]) => write(tokenPath, token)

export const config = {
  gym: process.env.OPENMAGICLINE_GYM ?? "",
  username: process.env.OPENMAGICLINE_USERNAME ?? "",
  password: process.env.OPENMAGICLINE_PASSWORD ?? "",
}

export default async (): Promise<Openmagicline> => {
  const token = readToken()

  const instance = new Openmagicline(config)

  if (token) {
    try {
      await instance.login(token)
    } catch {
      console.log("getting new token because the existing was invalid")
      await instance.login()
    }
  } else {
    console.log("getting new token")
    await instance.login()
  }

  if (instance.cookies) saveToken(instance.cookies)

  return instance
}

const randomNumber = (m = 0, M = 1) => Math.random() * (M - m) + m

/**
 * it seems that magicline starts to return 429s pretty early.
 * we delay calls randomly by 3-10 seconds to avoid this.
 */
export const delay = (): Promise<void> => {
  const delay = Math.floor(randomNumber(3e3, 10e3))
  return new Promise(r => setTimeout(r, delay))
}
