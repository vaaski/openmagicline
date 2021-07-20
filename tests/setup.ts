import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

import Openmagicline from "../src"

const tokenPath = join(__dirname, "../token.json")

const readToken = () => {
  const tokenString = readFileSync(tokenPath).toString()
  return JSON.parse(tokenString)
}

const saveToken = (token: string[]) => {
  const tokenString = JSON.stringify(token)
  writeFileSync(tokenPath, tokenString)
}

export const config = {
  gym: process.env.OPENMAGICLINE_GYM ?? "",
  username: process.env.OPENMAGICLINE_USERNAME ?? "",
  password: process.env.OPENMAGICLINE_PASSWORD ?? "",
}

export default async (): Promise<Openmagicline> => {
  const token = readToken()

  const instance = new Openmagicline(config)

  if (token) {
    console.log("logging in with existing token")
    try {
      instance.login(token)
    } catch (error) {
      console.log("logging in with token threw, getting new token")
      instance.login()
    }
  } else {
    console.log("getting new token")
    instance.login()
  }

  if (instance.cookies) saveToken(instance.cookies)

  return instance
}
