import type * as Openmagicline from "../openmagicline"

export namespace Customer {
  export interface Benefit {
    name: string
    available: number | null
    total: number | null
    hasUsages: boolean
    colorHex: string
    unit: string
    inclusiveContingentId: null
    purchasedContingentId: number | null
    trialContingentId: null
    freeUsage: boolean
    benefitId: number
    expiryDate: null | string
    createdDate: null | string
    durationText: null
    flat: boolean
  }

  export interface Base {
    databaseId: Openmagicline.Customer.CustomerID
  }

  export interface CheckinCondition {
    type: string
    messageKey: string
    args: string[]
  }

  export interface SearchedCustomer extends Base {
    firstname: string
    lastname: string
    gender: number
    dateOfBirth: Date | null
    lastCheckIn: Date | null
    facilityName: string
    customerNumber: string
    cardNumber: null
    lockerKey: null | string
    customerStatus: number
    purchasedContingentCode: null
    purchasedContingentType: null
    imageUrl: null
    checkedIn: boolean
    street: null | string
    houseNumber: null | string
    zip: null | string
    city: null | string
  }

  export interface AccessIdentification {
    databaseId: Openmagicline.Customer.AccessIdentificationID
    optlock: number
    fkOrganizationUnit: number
    createdDate: Date
    type: string
    uid: string
    stompDestination: string
  }

  export interface Contract {
    databaseId: number
    optlock: number
    rateId: number
    rateName: string
    publicRateName: string
    compunknownId: null
    currencyUnit: string
    startDate: string
    startDateOfUse: null | string
    startDateCurrentTerm: null | string
    preuseType: number
    endDate: string
    term: number
    extensionType: string
    termUnit: number
    termExtension: number
    termExtensionUnit: number
    extensionCancelationPeriod: null
    trialPeriod: null
    paymentChoice: null
    cancelationPeriod: number
    cancelationPeriodUnit: number
    nextCancelationDate: string
    active: boolean
    activeAgeBasedAdjustmentDto: null
    isCanceled: boolean | null
    isReversed: boolean
    imported: boolean
    hasBonusPeriods: boolean
    hasContractIdlePeriods: boolean
    contractOutlier: unknown[]
    currentPrice: number
    currentPriceWithDate: CurrentPriceWithDate
    nextPriceWithDate: null
    contractCancelation: ContractCancelation | null
    paymentDay: number | null
    contractPaymentFrequency: ContractPaymentFrequency
    moduleContracts: null
    flatFeeContracts: FlatFeeContract[] | null
    divergentAffiliate: null
    contractRestMaturityDto: null
    cancelationStrategy: string
    subsequentRateName: null
    subsequentRateDetailTerm: null
    subsequentRateDetailTermUnit: null
    subsequentRateDetailPaymentFrequencyTerm: null
    subsequentRateDetailPaymentFrequencyTermUnit: null
    subsequentRateDetailPaymentFrequencyType: null
    subsequentRateDetailPaymentFrequencyPrice: null
    subsequentContractId: null
    subsequentContractHasSubsequentContract: boolean
    subsequentContractName: null
    signatureStatus: string
    campaignId: null
    salesSource: string
    notes: null
    bonusPeriods: unknown[]
    contractIdlePeriods: unknown[]
    vouchers: unknown[]
    paymentRunGroupSimpleDto: null
  }

  export interface ContractCancelation {
    databaseId: number
    optlock: number
    fkCancelationReason: number
    cancelationReasonName: string
    cancelationReceiptDate: string
    cancelationDate: string
    extraordinaryCancelation: boolean
    createSystemMessage: boolean
    customerMessageId: null
    cancelationFee: null
    ignoreImportedChargesOnChargeCalendarCalculation: boolean
    cancelationByStudio: boolean
  }

  export interface ContractPaymentFrequency {
    databaseId: number
    optlock: number
    type: string
    value: number | null
    unit: number | null
    price: number
    money: Money
    paidTimePeriodCalculationType: null | string
    firstBookingDelay: FirstBookingDelay | null
    recurring: null
    extensionValue: null
    extensionUnit: null
    extensionPrice: null
    dueDateOffset: null
    applyFirstEncashmentOnFirstRegularCharge: boolean
    monthDayWithPrices: unknown[]
    termWithPrices: unknown[]
    monthDays: unknown[]
    ageBasedAdjustmentDtos: unknown[]
    firstEncashment: string
    dynamicAdjustmentRules: unknown[]
  }

  export interface FirstBookingDelay {
    term: number
    termUnit: number
  }

  export interface Money {
    amount: number
    currencyCode: string
  }

  export interface CurrentPriceWithDate {
    date: string
    price: number
  }

  export interface FlatFeeContract {
    databaseId: number
    optlock: number
    currencyUnit: string
    startDate: string
    startDateOfUse: null
    endDate: string
    imported: boolean
    paymentDay: null
    contractCancelation: null
    contractPaymentFrequency: ContractPaymentFrequency
    contractOutlier: null
    contractRestMaturityDto: null
    retroactive: boolean
    termInformation: null
    paymentChoice: null
    paymentRunGroupSimpleDto: null
    flatFeeRateId: number
    flatFeeRateName: string
    flatFeeRatePublicName: string
    flatFeeRateDetailPaymentFrequencyId: number
    reversed: boolean
    canceled: boolean
  }
}
