export type GetClassesOptions = {
	organizationUnitId?: number
	/** defaults to today */
	startDateTime?: Date | string
	/** defaults to 1 month from today */
	endDateTime?: Date | string
	/** defaults to 30 */
	maxResults?: number
}
