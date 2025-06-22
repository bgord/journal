import { expect } from "bun:test";
import * as bg from "@bgord/bun";

import * as Emotions from "../modules/emotions";

export const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = {
  server: {
    requestIP: () => ({ address: "127.0.0.1", family: "foo", port: "123" }),
  },
};

export const id = bg.NewUUID.generate();

export const alarmId = bg.NewUUID.generate();

export const GenericSituationLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.SITUATION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "work",
  },
} satisfies Emotions.Events.SituationLoggedEventType;

export const GenericEmotionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    label: Emotions.VO.GenevaWheelEmotion.gratitude,
    intensity: 3,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const GenericReactionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
    effectiveness: 1,
  },
} satisfies Emotions.Events.ReactionLoggedEventType;

export const GenericEmotionReappraisedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    newLabel: Emotions.VO.GenevaWheelEmotion.joy,
    newIntensity: 3,
  },
} satisfies Emotions.Events.EmotionReappraisedEventType;

export const GenericReactionEvaluatedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_EVALUATED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Went to bed",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 2,
  },
} satisfies Emotions.Events.ReactionEvaluatedEventType;

export const PositiveEmotionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    label: Emotions.VO.GenevaWheelEmotion.joy,
    intensity: 4,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const NegativeEmotionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    label: Emotions.VO.GenevaWheelEmotion.anger,
    intensity: 4,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const NegativeEmotionExtremeIntensityLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    label: Emotions.VO.GenevaWheelEmotion.anger,
    intensity: 5,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const NegativeEmotionExtremeIntensityReappraisedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    newLabel: Emotions.VO.GenevaWheelEmotion.anger,
    newIntensity: 5,
  },
} satisfies Emotions.Events.EmotionReappraisedEventType;

export const MaladaptiveReactionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 1,
  },
} satisfies Emotions.Events.ReactionLoggedEventType;

export const AdaptiveReactionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Went for a walk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.reappraisal,
    effectiveness: 4,
  },
} satisfies Emotions.Events.ReactionLoggedEventType;

export const GenericEmotionJournalEntryDeletedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_JOURNAL_ENTRY_DELETED,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: { id },
} satisfies Emotions.Events.EmotionJournalEntryDeletedEventType;

export const dateRange: Emotions.Services.Patterns.PatternDateRange = ["2025-06-16", "2025-06-23"] as const;

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType;

export const MoreNegativeThanPositiveEmotionsPatternDetectedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;

export const MultipleMaladaptiveReactionsPatternDetectedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.MultipleMaladaptiveReactionsPatternDetectedEventType;

export const LowCopingEffectivenessPatternDetectedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.LowCopingEffectivenessPatternDetectedEventType;

export const GenericAlarmGeneratedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  stream: `alarm_${alarmId}`,
  name: Emotions.Events.ALARM_GENERATED_EVENT,
  version: 1,
  payload: {
    alarmName: Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    alarmId,
    emotionJournalEntryId: id,
  },
} satisfies Emotions.Events.AlarmGeneratedEventType;
