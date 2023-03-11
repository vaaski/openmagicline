export * as Openmagicline from "./openmagicline"
export * as Magicline from "./magicline"

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
