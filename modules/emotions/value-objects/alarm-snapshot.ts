import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import { AlarmNameOption } from "./alarm-name-option";
import type { InactivityAlarmTriggerType } from "./alarm-trigger";
import type { EmotionIntensityType } from "./emotion-intensity";
import { GenevaWheelEmotion } from "./geneva-wheel-emotion.enum";

export type AlarmSnapshot = {
  id: bg.UUIDType;
  name: AlarmNameOption;
  advice: AI.AdviceType;
  generatedAt: tools.TimestampType;
  inactivityDays: InactivityAlarmTriggerType["inactivityDays"] | null;
  lastEntryTimestamp: InactivityAlarmTriggerType["lastEntryTimestamp"] | null;
  emotionLabel: GenevaWheelEmotion | null;
  emotionIntensity: EmotionIntensityType | null;
};
