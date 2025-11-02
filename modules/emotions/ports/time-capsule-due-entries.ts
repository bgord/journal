import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export type TimeCapsuleEntrySnapshot = {
  id: VO.EntryIdType;
  userId: Auth.VO.UserIdType;
  scheduledFor: tools.TimestampValueType;
  status: VO.TimeCapsuleEntryStatusEnum;
  situationDescription: VO.SituationDescriptionType;
  situationKind: VO.SituationKindOptions;
  emotionLabel: VO.GenevaWheelEmotion;
  emotionIntensity: VO.EmotionIntensityType;
  reactionDescription: VO.ReactionDescriptionType;
  reactionType: VO.ReactionTypeType;
  reactionEffectiveness: VO.ReactionEffectivenessType;
};

export interface TimeCapsuleDueEntriesPort {
  listDue(now: tools.TimestampVO): Promise<TimeCapsuleEntrySnapshot[]>;
}
