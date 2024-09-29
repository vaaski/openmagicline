import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { readFile, writeFile } from "node:fs/promises"

import { beforeEach } from "bun:test"

import { Openmagicline } from "../src"

const __dirname = dirname(fileURLToPath(import.meta.url))

const tokenPath = join(__dirname, "../test-cookies.txt")

const readToken = async () => {
	try {
		return await readFile(tokenPath, "utf8")
	} catch {
		return undefined
	}
}
const saveToken = async (token: string) => {
	return await writeFile(tokenPath, token)
}

export const config = {
	gym: process.env.OPENMAGICLINE_GYM ?? "",
	username: process.env.OPENMAGICLINE_USERNAME ?? "",
	password: process.env.OPENMAGICLINE_PASSWORD ?? "",
}

export const getInstance = async () => {
	const instance = new Openmagicline(config)
	const token = await readToken()

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

	if (instance.cookies) await saveToken(instance.cookies)

	return instance
}

const randomFloat = (m = 0, M = 1) => Math.random() * (M - m) + m
export const wait = (t: number): Promise<void> => {
	return new Promise((r) => setTimeout(r, t))
}

/**
 * it seems that magicline starts to return 429s pretty early.
 * we delay calls randomly by 2-6 seconds to avoid this.
 */
export const delay = (): Promise<void> => {
	const duration = Math.floor(randomFloat(2e3, 6e3))
	console.log("  delaying by", duration, "ms")
	return wait(duration)
}

beforeEach(delay)
