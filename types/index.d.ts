export * as Magicline from "./magicline"
export * as OMGL from "./openmagicline"

/**
 * the "organizationUnitId" used to identify different units for the same gym.
 * that's what i think what it is at least.
 *
 * if it's marked as optional it can be omitted for convenience, in which case it
 * falls back to the first listed unit, **but it *should* always be provided**.
 *
 * mine was 2 by default for some reason, you can find yours using `.permitted()`
 */
export type unitID = number

export type DeepPartial<T> = T extends object ? {
	[P in keyof T]?: DeepPartial<T[P]>
} : T
