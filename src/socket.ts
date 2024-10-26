import type { Debugger } from "debug"
import type { Openmagicline } from "."
import type { unitID } from "../types"

import WebSocket from "ws"

import { websocketHeaders } from "./util"

export const knownTopics = [
	"destination:/user/topic/currentlicense",
	"destination:/user/topic/app/status",
	"destination:/user/topic/lead",
	"destination:/user/topic/customerrecovery",
	"destination:/user/topic/studiotask",
	"destination:/user/topic/supportcenteractivity",
	"destination:/user/topic/featuremodule/configuration",
	"destination:/user/topic/downloadmanager",
	"destination:/user/topic/checkin",
] as const

export default class MagicSocket {
	public readonly socket: WebSocket

	private log: Debugger
	private sendLog: Debugger
	private receiveLog: Debugger

	private messageEnd = "\u0000"
	private heartbeatInterval?: ReturnType<typeof setInterval>

	constructor(
		private mgl: Openmagicline,
		unitID: unitID,
	) {
		this.log = mgl.log.extend("socket")
		this.sendLog = this.log.extend("send")
		this.receiveLog = this.log.extend("receive")

		const socketURL = new URL(this.mgl.baseUrl)
		socketURL.protocol = "wss:"
		socketURL.pathname = "ws"
		socketURL.searchParams.set("organizationUnitId", unitID.toString())

		const headers = websocketHeaders(this.mgl)

		this.socket = new WebSocket(socketURL.href, { headers })

		this.socket.on("open", () => {
			this.log("socket opened")
			this.send(this.initialMessage())
		})

		this.socket.on("message", (data) => {
			this.onMessage(data.toString())
		})
	}

	public readonly buildMessage = (
		type: string,
		metadata: string[],
		payload?: string,
	) => {
		const metaBlock = [type, ...metadata].join("\n")

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

		switch (type) {
			case "CONNECTED": {
				this.handleInitialMessage(metadata)
				break
			}
			case "":
				if (metadata.length === 1 && metadata[0] === "") {
					this.receiveLog("heartbeat")
					break
				}
			default:
				this.receiveLog(type, { metadata, payload })
				break
		}
	}

	public readonly send = (message: string) => {
		const trimmed = message.trim()

		if (trimmed === "") this.sendLog("heartbeat")
		else this.sendLog(trimmed)

		this.socket.send(message)
	}

	private sendHeartbeat = () => {
		this.send("\n")
	}

	private initialMessage = () => {
		return this.buildMessage("CONNECT", [
			"accept-version:1.2,1.1,1.0",
			"heart-beat:10000,10000",
		])
	}

	private handleInitialMessage = (metadata: string[]) => {
		const heartbeatData = metadata.find((m) => m.startsWith("heart-beat"))
		if (heartbeatData) {
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
	}

	public readonly close = () => {
		this.log("closing socket")
		clearInterval(this.heartbeatInterval)
		this.socket.close()
	}
}
