import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";
import type { SupportedLanguages } from "+infra/i18n";

export type TimeCapsuleEntrySnapshot = {
  id: VO.EntryIdType;
  userId: Auth.VO.UserIdType;
  scheduledFor: tools.TimestampType;
  status: VO.TimeCapsuleEntryStatusEnum;
  situationDescription: VO.SituationDescriptionType;
  situationLocation: VO.SituationLocationType;
  situationKind: VO.SituationKindOptions;
  emotionLabel: VO.GenevaWheelEmotion;
  emotionIntensity: VO.EmotionIntensityType;
  reactionDescription: VO.ReactionDescriptionType;
  reactionType: VO.ReactionTypeType;
  reactionEffectiveness: VO.ReactionEffectivenessType;
  language: SupportedLanguages;
};

export interface TimeCapsuleDueEntriesPort {
  listDue(now: tools.TimestampType): Promise<TimeCapsuleEntrySnapshot[]>;
}
