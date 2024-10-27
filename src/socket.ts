import type { Debugger } from "debug"
import type { Openmagicline } from "."
import type { Magicline, unitID } from "../types"

import WebSocket from "ws"

import { websocketHeaders } from "./util"

export const knownTopics = [
	"/user/topic/app/status",
	"/user/topic/checkin",
	"/user/topic/checkin/request",
	"/user/topic/checkout/request",
	"/user/topic/currentlicense",
	"/user/topic/customerrecovery",
	"/user/topic/downloadmanager",
	"/user/topic/featuremodule/configuration",
	"/user/topic/lead",
	"/user/topic/studiotask",
	"/user/topic/supportcenteractivity",
] as const

// apparently the `& {}` magic will give autocompletion for known topics but
// also allow any strings starting with `/user/topic/`
export type Topic =
	| (typeof knownTopics)[number]
	| (`/user/topic/${string}` & {})

// biome-ignore lint/suspicious/noExplicitAny: I am too lazy to properly type this
type CallbackFunction<T = any> = (data: T) => void

export default class MagicSocket {
	private socket: WebSocket

	private log: Debugger
	private sendLog: Debugger
	private receiveLog: Debugger

	private messageEnd = "\u0000"
	private heartbeatInterval?: ReturnType<typeof setInterval>

	private subscriptions: Map<Topic, Set<CallbackFunction>> = new Map()
	private subscriptionCounter = 0

	public readonly connected: Promise<void>
	private connectedResolve?: () => void

	constructor(
		private mgl: Openmagicline,
		unitID: unitID,
	) {
		this.log = mgl.log.extend("socket")
		this.sendLog = this.log.extend("send")
		this.receiveLog = this.log.extend("receive")

		this.connected = new Promise((resolve) => {
			this.connectedResolve = resolve
		})

		const socketURL = new URL(this.mgl.baseUrl)
		socketURL.protocol = "wss:"
		socketURL.pathname = "ws"
		socketURL.searchParams.set("organizationUnitId", unitID.toString())

		const headers = websocketHeaders(this.mgl)

		this.socket = new WebSocket(socketURL.href, { headers })

		this.socket.on("open", () => {
			this.log("socket opened")

			this.send(
				this.buildMessage("CONNECT", {
					"accept-version": "1.2,1.1,1.0",
					"heart-beat": "10000,10000",
				}),
			)
		})

		this.socket.on("message", (data) => {
			this.onMessage(data.toString())
		})
	}

	public readonly buildMessage = (
		type: string,
		metadata: Record<string, string>,
		payload?: string,
	) => {
		const metadataString = Object.entries(metadata).map(([key, value]) => {
			return `${key}:${value}`
		})

		const metaBlock = [type, ...metadataString].join("\n")

		return `${metaBlock}\n\n${payload ?? ""}${this.messageEnd}`
	}

	private parseMessage = (message: string) => {
		const cleaned = message.replace(this.messageEnd, "")
		const [metaBlock, payload] = cleaned.split("\n\n")
		if (!metaBlock) throw new Error("metaBlock not found")

		const [type, ...metadata] = metaBlock.split("\n")

		return [type, metadata, payload] as const
	}

	private onMessage = (message: string) => {
		const [type, metadata, payload] = this.parseMessage(message)

		const trimmed = message.replace(this.messageEnd, "").trim()
		if (trimmed === "") this.receiveLog("heartbeat")
		else this.receiveLog(trimmed)

		switch (type) {
			case "CONNECTED": {
				this.handleTypeCONNECTED(metadata)
				break
			}
			case "MESSAGE": {
				this.handleTypeMESSAGE(metadata, payload)
				break
			}
		}
	}

	public readonly send = (message: string) => {
		const trimmed = message.replace(this.messageEnd, "").trim()

		if (trimmed === "") this.sendLog("heartbeat")
		else this.sendLog(trimmed)

		this.socket.send(message)
	}

	private sendHeartbeat = () => {
		this.send("\n")
	}

	private handleTypeCONNECTED = (metadata: string[]) => {
		this.connectedResolve?.()

		const heartbeatData = metadata.find((m) => m.startsWith("heart-beat:"))
		if (!heartbeatData) return this.log("no heartbeat data found")

		const [, heartbeats] = heartbeatData.split(":")
		if (!heartbeats) throw new Error("heartbeats not found")

		const [, heartbeatOutgoing] = heartbeats.split(",")
		if (!heartbeatOutgoing) throw new Error("heartbeatOutgoing not found")

		this.log("heartbeat interval", heartbeatOutgoing)

		this.heartbeatInterval = setInterval(
			this.sendHeartbeat,
			Number(heartbeatOutgoing),
		)
	}

	private handleTypeMESSAGE = (metadata: string[], payload?: string) => {
		const destinationData = metadata.find((m) => m.startsWith("destination:"))
		if (!destinationData) return this.log("no destination data found")

		const [, destination] = destinationData.split(":")
		if (!destination) throw new Error("destination not found")

		const subscriptions = this.subscriptions.get(destination as Topic)
		if (!subscriptions) return

		for (const callback of subscriptions) {
			callback(payload ? JSON.parse(payload) : undefined)
		}
	}

	public readonly subscribe = <T>(
		topic: Topic,
		callback: CallbackFunction<T>,
	) => {
		const subscriptions = this.subscriptions.get(topic) ?? new Set()

		subscriptions.add(callback)

		if (!this.subscriptions.has(topic)) {
			this.subscriptions.set(topic, subscriptions)
		}

		this.send(
			this.buildMessage("SUBSCRIBE", {
				id: `${this.subscriptionCounter++}`,
				destination: topic,
			}),
		)

		return () => {
			this.subscriptions.get(topic)?.delete(callback)

			if (this.subscriptions.get(topic)?.size === 0) {
				this.subscriptions.delete(topic)
			}
		}
	}

	/** fires when a customer gets checked in or out */
	public readonly onCheckin = (
		callback: CallbackFunction<Magicline.Socket.Checkin>,
	) => {
		return this.subscribe("/user/topic/checkin", callback)
	}

	/**
	 * fires when a card gets tapped to a checkin device
	 * using magicline device manager
	 */
	public readonly onCheckinRequest = (
		callback: CallbackFunction<Magicline.Socket.CheckinRequest>,
	) => {
		return this.subscribe("/user/topic/checkin/request", callback)
	}

	public readonly close = () => {
		this.log("closing socket")
		clearInterval(this.heartbeatInterval)

		this.socket.removeAllListeners()
		this.socket.close()
	}
}
