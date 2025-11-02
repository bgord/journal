import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as AI from "../../ai/value-objects";
import type * as Auth from "../../auth/value-objects";
import type { AlarmNameOption } from "./alarm-name-option";
import type { AlarmStatusEnum } from "./alarm-status";
import type { InactivityAlarmTriggerType } from "./alarm-trigger";
import type { EmotionIntensityType } from "./emotion-intensity";
import type { EntryIdType } from "./entry-id";
import type { GenevaWheelEmotion } from "./geneva-wheel-emotion.enum";

export type AlarmSnapshot = {
  id: bg.UUIDType;
  name: AlarmNameOption;
  advice: AI.AdviceType;
  generatedAt: tools.TimestampValueType;
  inactivityDays: InactivityAlarmTriggerType["inactivityDays"] | null;
  lastEntryTimestamp: InactivityAlarmTriggerType["lastEntryTimestamp"] | null;
  emotionLabel: GenevaWheelEmotion | null;
  emotionIntensity: EmotionIntensityType | null;
  status: AlarmStatusEnum;
  entryId: EntryIdType;
  userId: Auth.UserIdType;
  weekIsoId: tools.WeekIsoIdType;
};
