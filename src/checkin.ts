import type mgl from "."
import type * as Responses from "$/magicline/responses"
import type * as Openmagicline from "$/openmagicline"
import { getDefaultUnitID } from "./util"

export async function getSlots(
  this: mgl,
  unitID?: Openmagicline.unitID,
  startDateTime?: Date,
  endDateTime?: Date
): Promise<Responses.Checkin.CheckinSlot[]> {
  if (!unitID) unitID = await getDefaultUnitID.call(this)

  if (!startDateTime) {
    startDateTime = new Date()
    startDateTime.setHours(0, 0, 0, 0)
  }
  if (!endDateTime) {
    endDateTime = new Date()
    endDateTime.setHours(23, 59, 59, 999)
  }

  return this.got("checkinbasedbenefitusages/slots", {
    searchParams: {
      organizationUnitId: unitID,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    },
  }).json()
}
