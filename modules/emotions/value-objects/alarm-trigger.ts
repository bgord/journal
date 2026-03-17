import * as tools from "@bgord/tools";
import * as v from "valibot";
import { EntryId } from "./entry-id";

export enum AlarmTriggerEnum {
  entry = "entry",
  inactivity = "inactivity",
}

export const EntryAlarmTrigger = v.object({
  type: v.literal(AlarmTriggerEnum.entry),
  entryId: EntryId,
});
export type EntryAlarmTriggerType = v.InferOutput<typeof EntryAlarmTrigger>;

const InactivityAlarmTrigger = v.object({
  type: v.literal(AlarmTriggerEnum.inactivity),
  inactivityDays: tools.IntegerPositive,
  lastEntryTimestamp: tools.TimestampValue,
});
export type InactivityAlarmTriggerType = v.InferOutput<typeof InactivityAlarmTrigger>;

export const AlarmTrigger = v.variant("type", [EntryAlarmTrigger, InactivityAlarmTrigger]);
export type AlarmTriggerType = v.InferOutput<typeof AlarmTrigger>;
