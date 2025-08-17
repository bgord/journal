import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";
import type { SupportedLanguages } from "+infra/i18n";

export type EntrySnapshot = {
  revision: tools.RevisionValueType;
  startedAt: tools.TimestampType;
  status: VO.EntryStatusEnum;
  id: VO.EntryIdType;
  situationDescription: VO.SituationDescriptionType;
  situationKind: VO.SituationKindOptions;
  situationLocation: VO.SituationLocationType;
  emotionLabel: VO.GenevaWheelEmotion | null;
  emotionIntensity: VO.EmotionIntensityType | null;
  reactionDescription: VO.ReactionDescriptionType | null;
  reactionType: VO.GrossEmotionRegulationStrategy | null;
  reactionEffectiveness: VO.ReactionEffectivenessType | null;
  language: SupportedLanguages;
  weekIsoId: tools.WeekIsoIdType;
  origin: VO.EntryOriginOption;
  userId: Auth.VO.UserIdType;
};
