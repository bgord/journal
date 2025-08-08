import * as tools from "@bgord/tools";
import { QuotaLimit } from "./quota-limit";
import { QuotaRule } from "./quota-rule";
import { QuotaWindow } from "./quota-window";
import { UsageCategory } from "./usage-category";

export const day = (ts: number) => new Date(ts).toISOString().slice(0, 10);

// TODO: extract somewhere else
export const RULES: QuotaRule[] = [
  {
    id: "USER_DAILY",
    window: QuotaWindow.DAY,
    limit: QuotaLimit.parse(10),
    bucket: (context) => `user:${context.userId}:day:${day(context.timestamp)}`,
    appliesTo: (_category) => true,
  },

  {
    id: "EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY",
    window: QuotaWindow.WEEK,
    limit: QuotaLimit.parse(1),
    bucket: (context) =>
      `user:${context.userId}:week:${tools.Week.fromTimestamp(context.timestamp).toIsoId()}:${UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT}`,
    appliesTo: (category) => category === UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
  },

  {
    id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
    window: QuotaWindow.WEEK,
    limit: QuotaLimit.parse(1),
    appliesTo: (category) => category === UsageCategory.EMOTIONS_ALARM_INACTIVITY,
    bucket: (context) =>
      `user:${context.userId}:week:${tools.Week.fromTimestamp(context.timestamp).toIsoId()}:${UsageCategory.EMOTIONS_ALARM_INACTIVITY}`,
  },

  {
    id: "EMOTIONS_ALARM_ENTRY",
    window: QuotaWindow.ALL_TIME,
    limit: QuotaLimit.parse(2),
    bucket: (context) => `user:${context.userId}:entry:${context.dimensions.entryId}:alarms`,
    appliesTo: (category) => category === UsageCategory.EMOTIONS_ALARM_ENTRY,
  },
];
