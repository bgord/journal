import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import { EntryId } from "./entry-id";

export enum AlarmTriggerEnum {
  entry = "entry",
  inactivity = "inactivity",
}

export const EntryAlarmTrigger = z.object({
  type: z.literal(AlarmTriggerEnum.entry),
  entryId: EntryId,
});
export type EntryAlarmTriggerType = z.infer<typeof EntryAlarmTrigger>;

const InactivityAlarmTrigger = z.object({
  type: z.literal(AlarmTriggerEnum.inactivity),
  inactivityDays: z.number().int().positive(),
  lastEntryTimestamp: tools.Timestamp,
});
export type InactivityAlarmTriggerType = z.infer<typeof InactivityAlarmTrigger>;

export const AlarmTrigger = z.discriminatedUnion("type", [EntryAlarmTrigger, InactivityAlarmTrigger]);
export type AlarmTriggerType = z.infer<typeof AlarmTrigger>;
