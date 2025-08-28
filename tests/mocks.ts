// cspell:disable
import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import type * as Preferences from "+preferences";
import * as Publishing from "+publishing";
import type * as System from "+system";
import type * as Schema from "+infra/schema";

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

export const historyId = crypto.randomUUID();

export const week = tools.Week.fromNow();
export const day = tools.Day.fromNow();

export const insights = new AI.Advice("Good job");

export const correlationId = "00000000-0000-0000-0000-000000000000";

export const revision = new tools.Revision(0);

export const revisionHeaders = (revision: tools.RevisionValueType = 0) => ({ "if-match": `W/${revision}` });
export const correlationIdHeaders = { "x-correlation-id": correlationId };
export const correlationIdAndRevisionHeaders = (revision: tools.RevisionValueType = 0) => ({
  "if-match": `W/${revision}`,
  "x-correlation-id": correlationId,
});

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

export const advice = new AI.Advice("You should do something");

export const shareableLinkId = crypto.randomUUID();
export const shareableLinkCreatedAt = tools.Time.Now().value;

export const publicationSpecification = "entries";
export const anotherPublicationSpecification = "other";

export const dateRange = new tools.DateRange(tools.Timestamp.parse(0), tools.Timestamp.parse(1000));

export const duration = tools.Time.Seconds(1);

const client = bg.Client.from(ip.server.requestIP().address, "anon");
export const visitorId = new bg.VisitorIdHash(client);
export const visitorIdRaw = "cbc46a7ff4f622ab";

export const accessContext: Publishing.VO.AccessContext = { timestamp: tools.Time.Now().value, visitorId };

export const hourHasPassedTimestamp = tools.Time.Now().value;

export const scheduledAt = tools.Time.Now().value;
export const scheduledFor = tools.Time.Now().Add(tools.Time.Hours(2)).ms;

export const aiRequestRegisteredTimestamp = tools.Time.Now().value;

export const EmotionsAlarmEntryContext: AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_ENTRY> = {
  userId: userId,
  category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
  timestamp: tools.Time.Now().value,
  dimensions: { entryId: entryId },
};

export const EmotionsWeeklyReviewInsightContext: AI.RequestContext<AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT> =
  {
    userId: userId,
    category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
    timestamp: tools.Time.Now().value,
    dimensions: {},
  };

export const EmotionsAlarmInactivityWeeklyContext: AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY> =
  {
    userId: userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
    timestamp: tools.Time.Now().value,
    dimensions: {},
  };

export const userDailyBucket = `user:${userId}:day:${tools.Day.fromNow().toIsoId()}`;
export const emotionsAlarmEntryBucket = `user:${userId}:entry:${entryId}:alarms`;
export const emotionsWeeklyReviewInsightWeeklyBucket = `user:${userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_weekly_review_insight`;
export const emotionsAlarmInactivityWeeklyBucket = `user:${userId}:week:${tools.Week.fromTimestamp(tools.Time.Now().value).toIsoId()}:emotions_alarm_inactivity`;

export const head = {
  exists: true,
  etag: "etag-123",
  size: tools.Size.fromBytes(1234),
  lastModified: tools.Timestamp.parse(Date.UTC(2024, 1, 2, 3, 4, 5)),
  mime: new tools.Mime("image/webp"),
};

export const GenericSituationLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.SITUATION_LOGGED_EVENT,
  payload: {
    entryId,
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "work",
    userId,
    origin: Emotions.VO.EntryOriginOption.web,
  },
} satisfies Emotions.Events.SituationLoggedEventType;

export const GenericSituationLoggedTimeCapsuleEvent = {
  ...GenericSituationLoggedEvent,
  payload: {
    ...GenericSituationLoggedEvent.payload,
    origin: Emotions.VO.EntryOriginOption.time_capsule,
  },
} satisfies Emotions.Events.SituationLoggedEventType;

export const GenericEmotionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
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
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.REACTION_LOGGED_EVENT,
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
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
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
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.REACTION_EVALUATED_EVENT,
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
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.EMOTION_LOGGED_EVENT,
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
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
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
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.ENTRY_DELETED_EVENT,
  payload: { entryId, userId },
} satisfies Emotions.Events.EntryDeletedEventType;

export const GenericTimeCapsuleEntryScheduledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.TIME_CAPSULE_ENTRY_SCHEDULED_EVENT,
  payload: {
    entryId,
    userId,
    situation: {
      description: "I finished a project",
      kind: Emotions.VO.SituationKindOptions.achievement,
      location: "work",
    },
    emotion: {
      label: Emotions.VO.GenevaWheelEmotion.gratitude,
      intensity: 3,
    },
    reaction: {
      description: "Got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
      effectiveness: 1,
    },
    scheduledFor,
    scheduledAt,
  },
} satisfies Emotions.Events.TimeCapsuleEntryScheduledEventType;

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_pattern_detection_${userId}_${week.toIsoId()}`,
  version: 1,
  name: Emotions.Events.POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT,
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
  version: 1,
  name: Emotions.Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
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
  version: 1,
  name: Emotions.Events.MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT,
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
  version: 1,
  name: Emotions.Events.LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT,
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
  version: 1,
  name: Emotions.Events.ALARM_GENERATED_EVENT,
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
  version: 1,
  name: Emotions.Events.ALARM_GENERATED_EVENT,
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
  version: 1,
  name: Emotions.Events.ALARM_ADVICE_SAVED_EVENT,
  payload: { advice: advice.get(), alarmId, userId },
} satisfies Emotions.Events.AlarmAdviceSavedEventType;

export const GenericAlarmNotificationRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.ALARM_NOTIFICATION_REQUESTED_EVENT,
  payload: {
    alarmId,
    trigger: entryDetection.trigger,
    alarmName: entryDetection.name,
    userId,
    advice: advice.get(),
  },
} satisfies Emotions.Events.AlarmNotificationRequestedEventType;

export const GenericInactivityAlarmNotificationRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.ALARM_NOTIFICATION_REQUESTED_EVENT,
  payload: {
    alarmId,
    trigger: inactivityDetection.trigger,
    alarmName: inactivityDetection.name,
    userId,
    advice: advice.get(),
  },
} satisfies Emotions.Events.AlarmNotificationRequestedEventType;

export const GenericAlarmNotificationSentEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT,
  payload: { alarmId },
} satisfies Emotions.Events.AlarmNotificationSentEventType;

export const GenericAlarmCancelledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.ALARM_CANCELLED_EVENT,
  payload: { alarmId, userId },
} satisfies Emotions.Events.AlarmCancelledEventType;

export const GenericWeeklyReviewRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
  payload: { weekIsoId: week.toIsoId(), weeklyReviewId, userId },
} satisfies Emotions.Events.WeeklyReviewRequestedEventType;

export const GenericWeeklyReviewSkippedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
  payload: { weekIsoId: week.toIsoId(), userId },
} satisfies Emotions.Events.WeeklyReviewSkippedEventType;

export const GenericWeeklyReviewCompletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: "WEEKLY_REVIEW_COMPLETED_EVENT",
  payload: { insights: insights.get(), weeklyReviewId, weekIsoId: week.toIsoId(), userId },
} satisfies Emotions.Events.WeeklyReviewCompletedEventType;

export const GenericWeeklyReviewFailedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: expect.any(String),
  version: 1,
  name: "WEEKLY_REVIEW_FAILED_EVENT",
  payload: { weekIsoId: week.toIsoId(), weeklyReviewId, userId },
} satisfies Emotions.Events.WeeklyReviewFailedEventType;

export const GenericWeeklyReviewExportByEmailRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_review_export_by_email_${weeklyReviewExportId}`,
  version: 1,
  name: "WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT",
  payload: { weeklyReviewId, userId, weeklyReviewExportId, attempt: 1 },
} satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType;

export const GenericWeeklyReviewExportByEmailFailedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `weekly_review_export_by_email_${weeklyReviewExportId}`,
  version: 1,
  name: "WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT",
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

export const GenericShareableLinkCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_CREATED_EVENT",
  payload: {
    shareableLinkId,
    ownerId: userId,
    publicationSpecification,
    durationMs: duration.ms as tools.TimestampType,
    dateRangeStart: dateRange.getStart(),
    dateRangeEnd: dateRange.getEnd(),
    createdAt: shareableLinkCreatedAt,
  },
} satisfies Publishing.Events.ShareableLinkCreatedEventType;

export const GenericShareableLinkExpiredEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_EXPIRED_EVENT",
  payload: { shareableLinkId },
} satisfies Publishing.Events.ShareableLinkExpiredEventType;

export const GenericShareableLinkRevokedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_REVOKED_EVENT",
  payload: { shareableLinkId },
} satisfies Publishing.Events.ShareableLinkRevokedEventType;

export const GenericShareableLinkAccessedAcceptedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_ACCESSED_EVENT",
  payload: {
    shareableLinkId,
    ownerId: userId,
    publicationSpecification,
    validity: Publishing.VO.AccessValidity.accepted,
    visitorId: visitorIdRaw,
    timestamp: accessContext.timestamp,
    reason: "active",
  },
} satisfies Publishing.Events.ShareableLinkAccessedEventType;

export const GenericShareableLinkAccessedExpiredEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_ACCESSED_EVENT",
  payload: {
    shareableLinkId,
    ownerId: userId,
    publicationSpecification,
    validity: Publishing.VO.AccessValidity.rejected,
    visitorId: visitorIdRaw,
    timestamp: accessContext.timestamp,
    reason: "expired",
  },
} satisfies Publishing.Events.ShareableLinkAccessedEventType;

export const GenericShareableLinkAccessedRevokedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_ACCESSED_EVENT",
  payload: {
    shareableLinkId,
    ownerId: userId,
    publicationSpecification,
    validity: Publishing.VO.AccessValidity.rejected,
    visitorId: visitorIdRaw,
    timestamp: accessContext.timestamp,
    reason: "revoked",
  },
} satisfies Publishing.Events.ShareableLinkAccessedEventType;

export const GenericShareableLinkAccessedWrongSpecEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_ACCESSED_EVENT",
  payload: {
    shareableLinkId,
    ownerId: userId,
    publicationSpecification: anotherPublicationSpecification,
    validity: Publishing.VO.AccessValidity.rejected,
    visitorId: visitorIdRaw,
    timestamp: accessContext.timestamp,
    reason: "wrong_specification_publication",
  },
} satisfies Publishing.Events.ShareableLinkAccessedEventType;

export const GenericHourHasPassedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: hourHasPassedTimestamp },
} satisfies System.Events.HourHasPassedEventType;

export const GenericHourHasPassedMondayUtc18Event = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: tools.Timestamp.parse(1754330400000) },
} satisfies System.Events.HourHasPassedEventType;

export const GenericHourHasPassedWednesdayUtc18Event = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: tools.Timestamp.parse(1754503200000) },
} satisfies System.Events.HourHasPassedEventType;

export const GenericAiRequestRegisteredEmotionsAlarmEntryEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `user_ai_usage_${userId}`,
  version: 1,
  name: "AI_REQUEST_REGISTERED_EVENT",
  payload: {
    category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
    dimensions: { entryId },
    userId,
    timestamp: aiRequestRegisteredTimestamp,
  },
} satisfies AI.Events.AiRequestRegisteredEventType;

export const GenericAiQuotaExceededEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `user_ai_usage_${userId}`,
  version: 1,
  name: "AI_QUOTA_EXCEEDED_EVENT",
  payload: { userId, timestamp: aiRequestRegisteredTimestamp },
} satisfies AI.Events.AiQuotaExceededEventType;

export const GenericEntryHistorySituationLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `history_${entryId}`,
  version: 1,
  name: "HISTORY_POPULATED_EVENT",
  payload: {
    id: historyId,
    operation: "entry.situation.logged",
    subject: entryId,
    payload: {
      description: "I finished a project",
      kind: Emotions.VO.SituationKindOptions.achievement,
      location: "work",
    },
  },
} satisfies bg.History.Events.HistoryPopulatedEventType;

export const GenericEntryHistoryEmotionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `history_${entryId}`,
  version: 1,
  name: "HISTORY_POPULATED_EVENT",
  payload: {
    id: historyId,
    operation: "entry.emotion.logged",
    subject: entryId,
    payload: {
      label: Emotions.VO.GenevaWheelEmotion.gratitude,
      intensity: 3,
    },
  },
} satisfies bg.History.Events.HistoryPopulatedEventType;

export const GenericEntryHistoryReactionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `history_${entryId}`,
  version: 1,
  name: "HISTORY_POPULATED_EVENT",
  payload: {
    id: historyId,
    operation: "entry.reaction.logged",
    subject: entryId,
    payload: {
      description: "Got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
      effectiveness: 1,
    },
  },
} satisfies bg.History.Events.HistoryPopulatedEventType;

export const GenericEntryHistoryEmotionReappraisedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `history_${entryId}`,
  version: 1,
  name: "HISTORY_POPULATED_EVENT",
  payload: {
    id: historyId,
    operation: "entry.emotion.reappraised",
    subject: entryId,
    payload: {
      label: Emotions.VO.GenevaWheelEmotion.joy,
      intensity: 3,
    },
  },
} satisfies bg.History.Events.HistoryPopulatedEventType;

export const GenericEntryHistoryReactionEvaluatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `history_${entryId}`,
  version: 1,
  name: "HISTORY_POPULATED_EVENT",
  payload: {
    id: historyId,
    operation: "entry.reaction.evaluated",
    subject: entryId,
    payload: {
      description: "Went to bed",
      type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
      effectiveness: 2,
    },
  },
} satisfies bg.History.Events.HistoryPopulatedEventType;

export const GenericEntryHistoryClearedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `history_${entryId}`,
  version: 1,
  name: "HISTORY_CLEARED_EVENT",
  payload: { subject: entryId },
} satisfies bg.History.Events.HistoryClearedEventType;

export const GenericAccountCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `account_${userId}`,
  version: 1,
  name: "ACCOUNT_CREATED_EVENT",
  payload: { userId, timestamp: tools.Time.Now().value },
} satisfies Auth.Events.AccountCreatedEventType;

export const GenericUserLanguageSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `preferences_${userId}`,
  version: 1,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: SupportedLanguages.en },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericUserLanguageSetPLEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `preferences_${userId}`,
  version: 1,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: SupportedLanguages.pl },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericProfileAvatarUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `preferences_${userId}`,
  version: 1,
  name: "PROFILE_AVATAR_UPDATED_EVENT",
  payload: { userId, key: tools.ObjectKey.parse(`users/${userId}/avatar.webp`), etag: "noop" },
} satisfies Preferences.Events.ProfileAvatarUpdatedEventType;

export const GenericProfileAvatarRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: expect.any(Number),
  stream: `preferences_${userId}`,
  version: 1,
  name: "PROFILE_AVATAR_REMOVED_EVENT",
  payload: { userId },
} satisfies Preferences.Events.ProfileAvatarRemovedEventType;

export const partialEntry: Emotions.VO.EntrySnapshot = {
  revision: 0,
  startedAt: tools.Time.Now().value,
  status: Emotions.VO.EntryStatusEnum.actionable,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
  situationLocation: "work",
  emotionLabel: Emotions.VO.GenevaWheelEmotion.anger,
  emotionIntensity: 5,
  reactionDescription: null,
  reactionEffectiveness: null,
  reactionType: null,
  weekIsoId: week.toIsoId(),
  origin: Emotions.VO.EntryOriginOption.web,
  userId,
};

export const fullEntry: Emotions.VO.EntrySnapshot = {
  revision: 0,
  startedAt: tools.Time.Now().value,
  status: Emotions.VO.EntryStatusEnum.actionable,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
  situationLocation: "work",
  emotionLabel: Emotions.VO.GenevaWheelEmotion.anger,
  emotionIntensity: 5,
  reactionDescription: "Got drunk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
  reactionEffectiveness: 1,
  weekIsoId: week.toIsoId(),
  origin: Emotions.VO.EntryOriginOption.web,
  userId,
};

export const timeCapsuleEntry: Emotions.Ports.TimeCapsuleEntrySnapshot = {
  scheduledFor,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
  situationLocation: "work",
  emotionLabel: Emotions.VO.GenevaWheelEmotion.gratitude,
  emotionIntensity: 3,
  reactionDescription: "Got drunk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
  reactionEffectiveness: 1,
  status: Emotions.VO.TimeCapsuleEntryStatusEnum.scheduled,
  userId,
};

export const timeCapsuleEntryPublished: Emotions.Ports.TimeCapsuleEntrySnapshot = {
  ...timeCapsuleEntry,
  status: Emotions.VO.TimeCapsuleEntryStatusEnum.published,
};

export const positiveMaladaptiveEntry: Emotions.VO.EntrySnapshot = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.joy,
  emotionIntensity: 4,

  reactionDescription: "Got drunk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
  reactionEffectiveness: 1,
};

export const positiveAdaptiveEntry: Emotions.VO.EntrySnapshot = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.joy,
  emotionIntensity: 4,

  reactionDescription: "Went for a walk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.reappraisal,
  reactionEffectiveness: 4,
};

export const positiveEmotionEntry: Emotions.VO.EntrySnapshot = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.joy,
  emotionIntensity: 4,
};

export const negativeEmotionEntry: Emotions.VO.EntrySnapshot = {
  ...fullEntry,

  emotionLabel: Emotions.VO.GenevaWheelEmotion.anger,
  emotionIntensity: 4,
};

export const weeklyReview: Emotions.VO.WeeklyReviewSnapshot = {
  id: weeklyReviewId,
  userId,
  weekIsoId: week.toIsoId(),
  createdAt: tools.Time.Now().value,
  insights: insights.get(),
  status: Emotions.VO.WeeklyReviewStatusEnum.completed,
};

export const weeklyReviewSkipped: Emotions.VO.WeeklyReviewSnapshot = {
  ...weeklyReview,
  status: Emotions.VO.WeeklyReviewStatusEnum.skipped,
};

export const weeklyReviewFull: Emotions.Queries.WeeklyReviewExportDto = {
  ...weeklyReview,
  patternDetections: [],
  entries: [],
  alarms: [],
};

export const alarm: Emotions.VO.AlarmSnapshot = {
  id: alarmId,
  generatedAt: tools.Time.Now().value,
  entryId,
  status: Emotions.VO.AlarmStatusEnum.notification_requested,
  name: Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  advice: advice.get(),
  emotionLabel: null,
  emotionIntensity: null,
  inactivityDays: null,
  lastEntryTimestamp: null,
  userId,
  weekIsoId: week.toIsoId(),
};

export const patternDetection: Emotions.VO.PatternDetectionSnapshot = {
  id: crypto.randomUUID(),
  createdAt: tools.Time.Now().value,
  name: Emotions.VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern,
  weekIsoId: week.toIsoId(),
  userId,
};

export const shareableLink: Schema.SelectShareableLinks = {
  id: shareableLinkId,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  status: Publishing.VO.ShareableLinkStatusEnum.active,
  revision: 0,
  ownerId: userId,
  publicationSpecification: "entries",
  dateRangeStart: Date.now(),
  dateRangeEnd: Date.now(),
  durationMs: Date.now(),
  expiresAt: Date.now(),
  hidden: false,
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

export const entryText = `Situation description: ${fullEntry.situationDescription}`;

export const entryMarkdown = `# Situation description: ${fullEntry.situationDescription}`;

const PLACEHOLDER_PDF_BASE64 =
  "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoK MiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoz IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQy XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9u dCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5 cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1Jv bWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAov RjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhy ZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAw MDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAw MDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVF T0YK";

export const PDF = Buffer.from(PLACEHOLDER_PDF_BASE64, "base64");
