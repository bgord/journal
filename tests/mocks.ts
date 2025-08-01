// cspell:disable
import { expect } from "bun:test";
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

export const entryId = crypto.randomUUID();

export const alarmId = crypto.randomUUID();

export const email = "user@example.com";
export const anotherEmail = "another@example.com";

export const userId = crypto.randomUUID();
export const anotherUserId = crypto.randomUUID();

export const weeklyReviewId = crypto.randomUUID();

export const weeklyReviewExportId = crypto.randomUUID();

export const week = tools.Week.fromNow();

export const correlationId = "00000000-0000-0000-0000-000000000000";

export const revision = new tools.Revision(0);

export const revisionHeaders = (revision: tools.RevisionValueType = 0) => ({ "if-match": `W/${revision}` });

export const entryTrigger = {
  type: Emotions.VO.AlarmTriggerEnum.entry,
  entryId,
} as const;

export const entryDetection = new Emotions.VO.AlarmDetection(
  entryTrigger,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
);

export const inactivityTrigger = {
  type: Emotions.VO.AlarmTriggerEnum.inactivity,
  inactivityDays: 7,
  lastEntryTimestamp: tools.Timestamp.parse(1000),
} as const;

export const inactivityDetection = new Emotions.VO.AlarmDetection(
  inactivityTrigger,
  Emotions.VO.AlarmNameOption.INACTIVITY_ALARM,
);

export const advice = new Emotions.VO.Advice("You should do something");

export const GenericSituationLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.SITUATION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId,
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "work",
    language: SupportedLanguages.en,
    userId,
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
    entryId,
    label: Emotions.VO.GenevaWheelEmotion.gratitude,
    intensity: 3,
    userId,
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
    entryId,
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
    effectiveness: 1,
    userId,
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
    entryId,
    newLabel: Emotions.VO.GenevaWheelEmotion.joy,
    newIntensity: 3,
    userId,
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
    entryId,
    description: "Went to bed",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 2,
    userId,
  },
} satisfies Emotions.Events.ReactionEvaluatedEventType;

export const NegativeEmotionExtremeIntensityLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: {
    entryId,
    label: Emotions.VO.GenevaWheelEmotion.anger,
    intensity: 5,
    userId,
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
    entryId,
    newLabel: Emotions.VO.GenevaWheelEmotion.anger,
    newIntensity: 5,
    userId,
  },
} satisfies Emotions.Events.EmotionReappraisedEventType;

export const GenericEntryDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  name: Emotions.Events.ENTRY_DELETED_EVENT,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  payload: { entryId, userId },
} satisfies Emotions.Events.EntryDeletedEventType;

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${userId}_${week.toIsoId()}`,
  name: Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {
    userId,
    weekIsoId: week.toIsoId(),
    entryIds: [entryId, entryId, entryId],
    name: Emotions.VO.PatternNameOption.PositiveEmotionWithMaladaptiveReactionPattern,
  },
} satisfies Emotions.Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType;

export const MoreNegativeThanPositiveEmotionsPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${userId}_${week.toIsoId()}`,
  name: Emotions.Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {
    userId,
    weekIsoId: week.toIsoId(),
    name: Emotions.VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern,
  },
} satisfies Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;

export const MaladaptiveReactionsPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${userId}_${week.toIsoId()}`,
  name: Emotions.Events.MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {
    userId,
    weekIsoId: week.toIsoId(),
    entryIds: [entryId, entryId, entryId],
    name: Emotions.VO.PatternNameOption.MaladaptiveReactionsPattern,
  },
} satisfies Emotions.Events.MaladaptiveReactionsPatternDetectedEventType;

export const LowCopingEffectivenessPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${userId}_${week.toIsoId()}`,
  name: Emotions.Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
  version: 1,
  payload: {
    userId,
    weekIsoId: week.toIsoId(),
    name: Emotions.VO.PatternNameOption.LowCopingEffectivenessPattern,
  },
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
    trigger: entryTrigger,
    userId,
  },
} satisfies Emotions.Events.AlarmGeneratedEventType;

export const GenericInactivityAlarmGeneratedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_GENERATED_EVENT,
  version: 1,
  payload: {
    alarmName: Emotions.VO.AlarmNameOption.INACTIVITY_ALARM,
    alarmId,
    trigger: inactivityTrigger,
    userId,
  },
} satisfies Emotions.Events.AlarmGeneratedEventType;

export const GenericAlarmAdviceSavedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_ADVICE_SAVED_EVENT,
  version: 1,
  payload: { advice: advice.get(), alarmId, userId },
} satisfies Emotions.Events.AlarmAdviceSavedEventType;

export const GenericAlarmNotificationSentEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT,
  version: 1,
  payload: { alarmId, trigger: entryDetection.trigger, alarmName: entryDetection.name, userId },
} satisfies Emotions.Events.AlarmNotificationSentEventType;

export const GenericInactivityAlarmNotificationSentEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT,
  version: 1,
  payload: { alarmId, trigger: inactivityDetection.trigger, alarmName: inactivityDetection.name, userId },
} satisfies Emotions.Events.AlarmNotificationSentEventType;

export const GenericAlarmCancelledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.ALARM_CANCELLED_EVENT,
  version: 1,
  payload: { alarmId, userId },
} satisfies Emotions.Events.AlarmCancelledEventType;

export const GenericWeeklyReviewRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
  version: 1,
  payload: { weekIsoId: week.toIsoId(), weeklyReviewId, userId },
} satisfies Emotions.Events.WeeklyReviewRequestedEventType;

export const GenericWeeklyReviewSkippedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
  version: 1,
  payload: { weekIsoId: week.toIsoId(), userId },
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
    weekIsoId: week.toIsoId(),
    userId,
  },
} satisfies Emotions.Events.WeeklyReviewCompletedEventType;

export const GenericWeeklyReviewFailedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  name: "WEEKLY_REVIEW_FAILED_EVENT",
  version: 1,
  payload: { weekIsoId: week.toIsoId(), weeklyReviewId, userId },
} satisfies Emotions.Events.WeeklyReviewFailedEventType;

export const GenericWeeklyReviewExportByEmailRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_review_export_by_email_${weeklyReviewExportId}`,
  name: "WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT",
  version: 1,
  payload: { weeklyReviewId, userId, weeklyReviewExportId, attempt: 1 },
} satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType;

export const GenericWeeklyReviewExportByEmailFailedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_review_export_by_email_${weeklyReviewExportId}`,
  name: "WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT",
  version: 1,
  payload: { weeklyReviewId, userId, weeklyReviewExportId, attempt: 1 },
} satisfies Emotions.Events.WeeklyReviewExportByEmailFailedEventType;

export const GenericWeeklyReviewExportByEmailFailedEvent2nd = {
  ...GenericWeeklyReviewExportByEmailFailedEvent,
  payload: { ...GenericWeeklyReviewExportByEmailFailedEvent.payload, attempt: 2 },
} satisfies Emotions.Events.WeeklyReviewExportByEmailFailedEventType;

export const GenericWeeklyReviewExportByEmailFailedEvent3rd = {
  ...GenericWeeklyReviewExportByEmailFailedEvent,
  payload: { ...GenericWeeklyReviewExportByEmailFailedEvent.payload, attempt: 3 },
} satisfies Emotions.Events.WeeklyReviewExportByEmailFailedEventType;

export const GenericWeeklyReviewExportByEmailFailedEvent4th = {
  ...GenericWeeklyReviewExportByEmailFailedEvent,
  payload: { ...GenericWeeklyReviewExportByEmailFailedEvent.payload, attempt: 4 },
} satisfies Emotions.Events.WeeklyReviewExportByEmailFailedEventType;

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
  weekIsoId: week.toIsoId(),
  userId,
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
  weekIsoId: week.toIsoId(),
  userId,
};

export const fullEntryPl: Schema.SelectEntries = {
  ...fullEntry,
  language: SupportedLanguages.pl,
};

export const positiveMaladaptiveEntry: Schema.SelectEntries = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.joy,
  emotionIntensity: 4,

  reactionDescription: "Got drunk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
  reactionEffectiveness: 1,
};

export const positiveAdaptiveEntry: Schema.SelectEntries = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.joy,
  emotionIntensity: 4,

  reactionDescription: "Went for a walk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.reappraisal,
  reactionEffectiveness: 4,
};

export const positiveEmotionEntry: Schema.SelectEntries = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.joy,
  emotionIntensity: 4,
};

export const negativeEmotionEntry: Schema.SelectEntries = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.anger,
  emotionIntensity: 4,
};

export const fullEntryFormatted: Schema.SelectEntriesFull = {
  ...Emotions.Repos.EntryRepository.format(fullEntry),
  alarms: [],
};

export const weeklyReview: Schema.SelectWeeklyReviews = {
  id: weeklyReviewId,
  userId,
  weekIsoId: week.toIsoId(),
  createdAt: Date.now(),
  insights: "Good job", // TODO: extract
  status: Emotions.VO.WeeklyReviewStatusEnum.completed,
};

export const weeklyReviewSkipped: Schema.SelectWeeklyReviews = {
  ...weeklyReview,
  status: Emotions.VO.WeeklyReviewStatusEnum.skipped,
};

export const alarm: Schema.SelectAlarms = {
  id: alarmId,
  generatedAt: Date.now(),
  entryId,
  status: Emotions.VO.AlarmStatusEnum.notification_sent,
  name: Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  advice: advice.get(),
  emotionLabel: null,
  emotionIntensity: null,
  inactivityDays: null,
  lastEntryTimestamp: null,
  userId,
};

export const patternDetection: Schema.SelectPatternDetections = {
  id: crypto.randomUUID(),
  createdAt: Date.now(),
  name: Emotions.VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern,
  weekIsoId: week.toIsoId(),
  userId,
};

export const user = {
  name: email,
  email: email,
  emailVerified: false,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  id: userId,
};

export const anotherUser = {
  name: anotherEmail,
  email: anotherEmail,
  emailVerified: false,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  id: anotherUserId,
};

export const session = {
  expiresAt: new Date(),
  token: "wyNm82TTSvBtxXSh1mb7lZJ4WF557tv4",
  createdAt: new Date(),
  updatedAt: new Date(),
  ipAddress: "",
  userAgent: "Mozilla/5.0",
  userId,
  id: "JUFCrqCBwFT3MCJV0mAVYSXtLJOkNBVN",
};

export const anotherSession = {
  expiresAt: new Date(),
  token: "XFgejTtN28QI8cDEmE9Yb09yxRwQuGj0",
  createdAt: new Date(),
  updatedAt: new Date(),
  ipAddress: "",
  userAgent: "Mozilla/5.0",
  userId,
  id: "xXHd0LUChE6NiYnQXc8mwij7jjp5kUhs",
};

export const auth = { user, session };

export const anotherAuth = { user: anotherUser, session: anotherSession };

export const entryCsv = ["id,situationDescription", `${fullEntry.id},${fullEntry.situationDescription}`].join(
  "",
);
export const alarmCsv = ["id,name", `${alarm.id},${alarm.name}`].join("");

const PLACEHOLDER_PDF_BASE64 =
  "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoK MiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoz IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQy XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9u dCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5 cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1Jv bWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAov RjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhy ZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAw MDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAw MDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVF T0YK";

export const PDF = Buffer.from(PLACEHOLDER_PDF_BASE64, "base64");
