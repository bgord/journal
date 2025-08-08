import * as tools from "@bgord/tools";
import { QuotaLimit } from "./quota-limit";
import { QuotaRule } from "./quota-rule";
import { QuotaWindow } from "./quota-window";
import { UsageCategory } from "./usage-category";

export const day = (ts: number) => new Date(ts).toISOString().slice(0, 10);

export const USER_DAILY_RULE: QuotaRule = {
  id: "USER_DAILY",
  window: QuotaWindow.DAY,
  limit: QuotaLimit.parse(10),
  bucket: (context) => `user:${context.userId}:day:${day(context.timestamp)}`,
  appliesTo: (_category) => true,
};

export const EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE: QuotaRule = {
  id: "EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY",
  window: QuotaWindow.WEEK,
  limit: QuotaLimit.parse(1),
  bucket: (context) =>
    `user:${context.userId}:week:${tools.Week.fromTimestamp(context.timestamp).toIsoId()}:${UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT}`,
  appliesTo: (category) => category === UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
};

export const EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE: QuotaRule = {
  id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
  window: QuotaWindow.WEEK,
  limit: QuotaLimit.parse(1),
  appliesTo: (category) => category === UsageCategory.EMOTIONS_ALARM_INACTIVITY,
  bucket: (context) =>
    `user:${context.userId}:week:${tools.Week.fromTimestamp(context.timestamp).toIsoId()}:${UsageCategory.EMOTIONS_ALARM_INACTIVITY}`,
};

export const EMOTIONS_ALARM_ENTRY: QuotaRule = {
  id: "EMOTIONS_ALARM_ENTRY",
  window: QuotaWindow.ALL_TIME,
  limit: QuotaLimit.parse(2),
  bucket: (context) => `user:${context.userId}:entry:${context.dimensions.entryId}:alarms`,
  appliesTo: (category) => category === UsageCategory.EMOTIONS_ALARM_ENTRY,
};

// TODO: extract somewhere else
export const RULES: QuotaRule[] = [
  USER_DAILY_RULE,
  EMOTIONS_WEEKLY_REVIEW_INSIGHT_WEEKLY_RULE,
  EMOTIONS_ALARM_INACTIVITY_WEEKLY_RULE,
  EMOTIONS_ALARM_ENTRY,
];
