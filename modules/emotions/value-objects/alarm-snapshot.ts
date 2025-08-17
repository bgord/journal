import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as AI from "+ai";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export type AlarmSnapshot = {
  id: bg.UUIDType;
  name: VO.AlarmNameOption;
  advice: AI.AdviceType;
  generatedAt: tools.TimestampType;
  inactivityDays: VO.InactivityAlarmTriggerType["inactivityDays"] | null;
  lastEntryTimestamp: VO.InactivityAlarmTriggerType["lastEntryTimestamp"] | null;
  emotionLabel: VO.GenevaWheelEmotion | null;
  emotionIntensity: VO.EmotionIntensityType | null;
  status: VO.AlarmStatusEnum;
  entryId: VO.EntryIdType;
  userId: Auth.VO.UserIdType;
  weekIsoId: tools.WeekIsoIdType;
};
