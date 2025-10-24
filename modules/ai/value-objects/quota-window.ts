export enum QuotaWindowEnum {
  DAY = "DAY",
  WEEK = "WEEK",
  ALL_TIME = "ALL_TIME",
}

export class QuotaWindow {
  constructor(readonly value: QuotaWindowEnum) {}
}
