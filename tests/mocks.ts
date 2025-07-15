import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { SupportedLanguages } from "../infra/i18n";
import type * as Schema from "../infra/schema";

import * as Emotions from "../modules/emotions";

export const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = {
  server: {
    requestIP: () => ({ address: "127.0.0.1", family: "foo", port: "123" }),
  },
};

export const entryId = bg.NewUUID.generate();

export const alarmId = bg.NewUUID.generate();

export const weeklyReviewId = bg.NewUUID.generate();
export const weekStartedAt = 1750636800000 as tools.TimestampType;

export const correlationId = "00000000-0000-0000-0000-000000000000";

export const revision = new tools.Revision(0);

export const revisionHeaders = (revision: tools.RevisionValueType = 0) => ({ "if-match": `W/${revision}` });

export const GenericSituationLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.SITUATION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "work",
    language: SupportedLanguages.en,
  },
} satisfies Emotions.Events.SituationLoggedEventType;

export const GenericEmotionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    label: Emotions.VO.GenevaWheelEmotion.gratitude,
    intensity: 3,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const GenericReactionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
    effectiveness: 1,
  },
} satisfies Emotions.Events.ReactionLoggedEventType;

export const GenericEmotionReappraisedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    newLabel: Emotions.VO.GenevaWheelEmotion.joy,
    newIntensity: 3,
  },
} satisfies Emotions.Events.EmotionReappraisedEventType;

export const GenericReactionEvaluatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_EVALUATED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    description: "Went to bed",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 2,
  },
} satisfies Emotions.Events.ReactionEvaluatedEventType;

export const PositiveEmotionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    label: Emotions.VO.GenevaWheelEmotion.joy,
    intensity: 4,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const NegativeEmotionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    label: Emotions.VO.GenevaWheelEmotion.anger,
    intensity: 4,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const NegativeEmotionExtremeIntensityLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    label: Emotions.VO.GenevaWheelEmotion.anger,
    intensity: 5,
  },
} satisfies Emotions.Events.EmotionLoggedEventType;

export const NegativeEmotionExtremeIntensityReappraisedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    newLabel: Emotions.VO.GenevaWheelEmotion.anger,
    newIntensity: 5,
  },
} satisfies Emotions.Events.EmotionReappraisedEventType;

export const MaladaptiveReactionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 1,
  },
} satisfies Emotions.Events.ReactionLoggedEventType;

export const AdaptiveReactionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId: entryId,
    description: "Went for a walk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.reappraisal,
    effectiveness: 4,
  },
} satisfies Emotions.Events.ReactionLoggedEventType;

export const GenericEntryDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.ENTRY_DELETED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: { entryId: entryId },
} satisfies Emotions.Events.EntryDeletedEventType;

export const dateRange: Emotions.Services.Patterns.PatternDateRange = ["2025-06-16", "2025-06-23"] as const;

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType;

export const MoreNegativeThanPositiveEmotionsPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;

export const MultipleMaladaptiveReactionsPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.MultipleMaladaptiveReactionsPatternDetectedEventType;

export const LowCopingEffectivenessPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${dateRange[0]}_${dateRange[1]}`,
  name: Emotions.Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {},
} satisfies Emotions.Events.LowCopingEffectivenessPatternDetectedEventType;

export const GenericAlarmGeneratedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_GENERATED_EVENT,
  version: 1,
  payload: {
    alarmName: Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    alarmId,
    entryId: entryId,
  },
} satisfies Emotions.Events.AlarmGeneratedEventType;

export const GenericAlarmAdviceSavedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_ADVICE_SAVED_EVENT,
  version: 1,
  payload: {
    advice: "You should do something",
    alarmId,
    entryId: entryId,
  },
} satisfies Emotions.Events.AlarmAdviceSavedEventType;

export const GenericAlarmNotificationSentEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT,
  version: 1,
  payload: { alarmId, entryId: entryId },
} satisfies Emotions.Events.AlarmNotificationSentEventType;

export const GenericAlarmCancelledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_CANCELLED_EVENT,
  version: 1,
  payload: { alarmId },
} satisfies Emotions.Events.AlarmCancelledEventType;

export const GenericWeeklyReviewRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
  version: 1,
  payload: { weekStartedAt, weeklyReviewId },
} satisfies Emotions.Events.WeeklyReviewRequestedEventType;

export const GenericWeeklyReviewSkippedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
  version: 1,
  payload: { weekStartedAt },
} satisfies Emotions.Events.WeeklyReviewSkippedEventType;

export const GenericWeeklyReviewCompletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: "WEEKLY_REVIEW_COMPLETED_EVENT",
  version: 1,
  payload: {
    insights: "Good job",
    weeklyReviewId,
    weekStartedAt,
  },
} satisfies Emotions.Events.WeeklyReviewCompletedEventType;

export const GenericWeeklyReviewFailedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: "WEEKLY_REVIEW_FAILED_EVENT",
  version: 1,
  payload: { weekStartedAt, weeklyReviewId },
} satisfies Emotions.Events.WeeklyReviewFailedEventType;

export const partialEntry: Schema.SelectEntries = {
  revision: 0,
  finishedAt: Date.now(),
  startedAt: Date.now(),
  status: Emotions.VO.AlarmStatusEnum.generated,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
  situationLocation: "work",
  emotionLabel: Emotions.VO.GenevaWheelEmotion.anger,
  emotionIntensity: 5,
  reactionDescription: null,
  reactionEffectiveness: null,
  reactionType: null,
  language: SupportedLanguages.en,
};

export const partialEntryFormatted: Schema.SelectEntriesFull = {
  ...Emotions.Repos.EntryRepository.format(partialEntry),
  alarms: [],
};

export const fullEntry: Schema.SelectEntries = {
  revision: 0,
  finishedAt: Date.now(),
  startedAt: Date.now(),
  status: Emotions.VO.AlarmStatusEnum.generated,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
  situationLocation: "work",
  emotionLabel: Emotions.VO.GenevaWheelEmotion.anger,
  emotionIntensity: 5,
  reactionDescription: "Got drunk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
  reactionEffectiveness: 1,
  language: SupportedLanguages.en,
};

export const fullEntryFormatted: Schema.SelectEntriesFull = {
  ...Emotions.Repos.EntryRepository.format(fullEntry),
  alarms: [],
};

export const alarm: Schema.SelectAlarms = {
  id: alarmId,
  generatedAt: Date.now(),
  entryId,
  status: Emotions.VO.AlarmStatusEnum.notification_sent,
  name: Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  advice: "You should do something",
  emotionLabel: null,
  emotionIntensity: null,
};
