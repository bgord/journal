import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export enum QuotaWindowEnum {
  DAY = "DAY",
  WEEK = "WEEK",
  ALL_TIME = "ALL_TIME",
}

export class QuotaWindow {
  constructor(readonly value: QuotaWindowEnum) {}

  resetsIn(clock: bg.ClockPort): tools.Duration {
    return {
      DAY: () => {
        const now = clock.now();
        const day = tools.Day.fromNow(now);

        return day.getEnd().difference(now);
      },
      WEEK: () => {
        const now = clock.now();
        const week = tools.Week.fromNow(now);

        return week.getEnd().difference(now);
      },
      ALL_TIME: () => tools.Duration.Ms(Number.MAX_SAFE_INTEGER),
    }[this.value]();
  }
}
