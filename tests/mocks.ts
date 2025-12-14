// cspell:disable
import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { Session, User } from "better-auth";
import { format } from "date-fns";
import * as AI from "+ai";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import type * as Preferences from "+preferences";
import * as Publishing from "+publishing";
import type * as System from "+system";
import type { EntrySnapshotFormatted } from "+app/http/emotions/list-entries";
import { EnvironmentSchema } from "+infra/env";
import type * as Schema from "+infra/schema";

export const Env = new bg.EnvironmentValidator({
  type: bg.NodeEnvironmentEnum.test,
  schema: EnvironmentSchema,
}).load(process.env);

// IDs
export const correlationId = "00000000-0000-0000-0000-000000000000";

export const entryId = bg.UUID.parse("e3799aaf-da3d-491b-b408-9c642cc3c312");
export const alarmId = bg.UUID.parse("de578009-c9a7-4a59-8fb7-5223f82ef9ef");
export const userId = bg.UUID.parse("60aac9b2-2c16-4e94-b024-0951723e0bed");
export const anotherUserId = bg.UUID.parse("cd74d060-d5de-4a81-8ffb-b2dc46cd4451");
export const weeklyReviewId = bg.UUID.parse("e212142f-0ac0-4641-a417-117a2909afa0");
export const weeklyReviewExportId = bg.UUID.parse("4d4964cf-1429-4861-b7f7-b255c0072990");
export const shareableLinkId = bg.UUID.parse("2e469d5a-8317-459a-a0b9-b9a019acca19");
export const historyId = bg.UUID.parse("8d79bd87-1709-4c15-b40c-cd0fafaa0113");
const patternDetectionId = bg.UUID.parse("d2ca7a35-76a0-42de-8a2c-32d8b14fdfab");

// Timestamps
export const T0 = tools.Timestamp.fromNumber(Date.UTC(2025, 0, 1, 0, 0, 0));

export const shareableLinkCreatedAt = T0;
export const hourHasPassedTimestamp = T0;
export const timeCapsuleEntryScheduledAt = T0;
export const timeCapsuleEntryScheduledFor = T0.add(tools.Duration.Days(2));
export const timeCapsuleEntryScheduledForDate = format(timeCapsuleEntryScheduledFor.ms, "yyyy-MM-dd");
export const timeCapsuleEntryScheduledForPast = T0.subtract(tools.Duration.Days(1));
export const timeCapsuleEntryScheduledForPastDate = format(timeCapsuleEntryScheduledForPast.ms, "yyyy-MM-dd");

export const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = { server: { requestIP: () => ({ address: "127.0.0.1", family: "foo", port: "123" }) } };

export const email = "user@example.com";
export const contact = { type: "email", address: email } as const;
export const anotherEmail = "another@example.com";

export const week = tools.Week.fromNow(T0);
export const weekStart = "2024/12/30";
export const weekEnd = "2025/01/05";

export const previousWeek = week.previous();
export const day = tools.Day.fromNow(T0);

export const insights = new AI.Advice("Good job");

export const revision = new tools.Revision(0);

export const revisionHeaders = (revision: tools.RevisionValueType = 0) => ({ "if-match": `W/${revision}` });
export const correlationIdHeaders = { "x-correlation-id": correlationId };
export const correlationIdAndRevisionHeaders = (revision: tools.RevisionValueType = 0) => ({
  "if-match": `W/${revision}`,
  "x-correlation-id": correlationId,
});

export const entryTrigger = { type: Emotions.VO.AlarmTriggerEnum.entry, entryId } as const;

export const entryDetection = new Emotions.VO.AlarmDetection(
  entryTrigger,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
);

export const inactivityTrigger = {
  type: Emotions.VO.AlarmTriggerEnum.inactivity,
  inactivityDays: 7,
  lastEntryTimestamp: T0.ms,
} as const;

export const inactivityDetection = new Emotions.VO.AlarmDetection(
  inactivityTrigger,
  Emotions.VO.AlarmNameOption.INACTIVITY_ALARM,
);

export const advice = new AI.Advice("You should do something");

export const publicationSpecification = "entries";
export const anotherPublicationSpecification = "other";

export const dateRangeStart = "2025-01-01";
export const dateRangeEnd = "2025-01-01";
export const dateRange = new tools.DateRange(
  T0,
  T0.add(tools.Duration.Days(1)).subtract(tools.Duration.Ms(1)),
);

export const durationMs = tools.Duration.Seconds(1).ms;

const client = bg.Client.from(ip.server.requestIP().address, "anon");
export const visitorId = new bg.VisitorIdHashAdapter(client);
export const visitorIdRaw = bg.VisitorId.parse("cbc46a7ff4f622ab");

export const accessContext: Publishing.VO.AccessContext = { timestamp: T0.ms, visitorId };

export const aiRequestRegisteredTimestamp = T0;

export const EmotionsAlarmEntryContext: AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_ENTRY> = {
  userId: userId,
  category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
  timestamp: T0.ms,
  dimensions: { entryId: entryId },
};

export const EmotionsWeeklyReviewInsightContext: AI.RequestContext<AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT> =
  {
    userId: userId,
    category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
    timestamp: T0.ms,
    dimensions: {},
  };

export const EmotionsAlarmInactivityWeeklyContext: AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY> =
  {
    userId: userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
    timestamp: T0.ms,
    dimensions: {},
  };

export const userDailyBucket = `user:${userId}:day:${tools.Day.fromNow(T0).toIsoId()}`;
export const emotionsAlarmEntryBucket = `user:${userId}:entry:${entryId}:alarms`;
export const emotionsWeeklyReviewInsightWeeklyBucket = `user:${userId}:week:${tools.Week.fromTimestamp(T0).toIsoId()}:emotions_weekly_review_insight`;
export const emotionsAlarmInactivityWeeklyBucket = `user:${userId}:week:${tools.Week.fromTimestamp(T0).toIsoId()}:emotions_alarm_inactivity`;

export const ruleInspection = {
  id: AI.USER_DAILY_RULE.id,
  consumed: false,
  limit: AI.USER_DAILY_RULE.limit,
  count: 3,
  remaining: 7,
  resetsInMs: tools.DurationMs.parse(0),
  resetsInHours: 0,
};

export const head = {
  exists: true,
  etag: bg.FileEtag.parse("0000000000000000000000000000000000000000000000000000000000000000"),
  size: tools.Size.fromBytes(1234),
  lastModified: T0,
  mime: tools.MIMES.webp,
};

export const objectKey = tools.ObjectKey.parse(`users/${userId}/avatar.webp`);

export const GenericSituationLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.SITUATION_LOGGED_EVENT,
  payload: {
    entryId,
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.ENTRY_DELETED_EVENT,
  payload: { entryId, userId },
} satisfies Emotions.Events.EntryDeletedEventType;

export const GenericTimeCapsuleEntryScheduledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: Emotions.Aggregates.Entry.getStream(entryId),
  version: 1,
  name: Emotions.Events.TIME_CAPSULE_ENTRY_SCHEDULED_EVENT,
  payload: {
    entryId,
    userId,
    situation: { description: "I finished a project", kind: Emotions.VO.SituationKindOptions.achievement },
    emotion: { label: Emotions.VO.GenevaWheelEmotion.gratitude, intensity: 3 },
    reaction: {
      description: "Got drunk",
      type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
      effectiveness: 1,
    },
    scheduledFor: timeCapsuleEntryScheduledFor.ms,
    scheduledAt: timeCapsuleEntryScheduledAt.ms,
  },
} satisfies Emotions.Events.TimeCapsuleEntryScheduledEventType;

export const PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
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
  createdAt: T0.ms,
  stream: `weekly_pattern_detection_${userId}_${previousWeek.toIsoId()}`,
  version: 1,
  name: Emotions.Events.MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT,
  payload: {
    userId,
    weekIsoId: previousWeek.toIsoId(),
    name: Emotions.VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern,
  },
} satisfies Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;

export const MaladaptiveReactionsPatternDetectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.ALARM_ADVICE_SAVED_EVENT,
  payload: { advice: advice.get(), alarmId, userId },
} satisfies Emotions.Events.AlarmAdviceSavedEventType;

export const GenericAlarmNotificationRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT,
  payload: { alarmId },
} satisfies Emotions.Events.AlarmNotificationSentEventType;

export const GenericAlarmCancelledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.ALARM_CANCELLED_EVENT,
  payload: { alarmId, userId },
} satisfies Emotions.Events.AlarmCancelledEventType;

export const GenericWeeklyReviewRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
  payload: { weekIsoId: previousWeek.toIsoId(), weeklyReviewId, userId },
} satisfies Emotions.Events.WeeklyReviewRequestedEventType;

export const GenericWeeklyReviewSkippedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: expect.any(String),
  version: 1,
  name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
  payload: { weekIsoId: previousWeek.toIsoId(), userId },
} satisfies Emotions.Events.WeeklyReviewSkippedEventType;

export const GenericWeeklyReviewCompletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: expect.any(String),
  version: 1,
  name: "WEEKLY_REVIEW_COMPLETED_EVENT",
  payload: { insights: insights.get(), weeklyReviewId, weekIsoId: previousWeek.toIsoId(), userId },
} satisfies Emotions.Events.WeeklyReviewCompletedEventType;

export const GenericWeeklyReviewFailedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: expect.any(String),
  version: 1,
  name: "WEEKLY_REVIEW_FAILED_EVENT",
  payload: { weekIsoId: previousWeek.toIsoId(), weeklyReviewId, userId },
} satisfies Emotions.Events.WeeklyReviewFailedEventType;

export const GenericWeeklyReviewExportByEmailRequestedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `weekly_review_export_by_email_${weeklyReviewExportId}`,
  version: 1,
  name: "WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT",
  payload: { weeklyReviewId, userId, weeklyReviewExportId, attempt: 1 },
} satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType;

export const GenericWeeklyReviewExportByEmailFailedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
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
  createdAt: T0.ms,
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_CREATED_EVENT",
  payload: {
    shareableLinkId,
    ownerId: userId,
    publicationSpecification,
    durationMs,
    dateRangeStart: dateRange.getStart().ms,
    dateRangeEnd: dateRange.getEnd().ms,
    createdAt: shareableLinkCreatedAt.ms,
  },
} satisfies Publishing.Events.ShareableLinkCreatedEventType;

export const GenericShareableLinkExpiredEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_EXPIRED_EVENT",
  payload: { shareableLinkId },
} satisfies Publishing.Events.ShareableLinkExpiredEventType;

export const GenericShareableLinkRevokedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `shareable_link_${shareableLinkId}`,
  version: 1,
  name: "SHAREABLE_LINK_REVOKED_EVENT",
  payload: { shareableLinkId },
} satisfies Publishing.Events.ShareableLinkRevokedEventType;

export const GenericShareableLinkAccessedAcceptedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: hourHasPassedTimestamp.ms },
} satisfies System.Events.HourHasPassedEventType;

export const GenericHourHasPassedMondayUtc18Event = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: tools.Timestamp.fromNumber(1754330400000).ms },
} satisfies System.Events.HourHasPassedEventType;

export function getNextMonday1800UTC(now: Date = new Date()): number {
  const daysUntilMonday = (8 - now.getUTCDay()) % 7;

  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate() + daysUntilMonday;

  return Date.UTC(y, m, d, 18, 0, 0, 0);
}

export const HourHasPassedNextMondayUtc18Event = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: tools.Timestamp.fromNumber(getNextMonday1800UTC()).ms },
} satisfies System.Events.HourHasPassedEventType;

export const GenericHourHasPassedWednesdayUtc18Event = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: tools.Timestamp.fromNumber(1754503200000).ms },
} satisfies System.Events.HourHasPassedEventType;

export const GenericAiRequestRegisteredEmotionsAlarmEntryEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `user_ai_usage_${userId}`,
  version: 1,
  name: "AI_REQUEST_REGISTERED_EVENT",
  payload: {
    category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
    dimensions: { entryId },
    userId,
    timestamp: aiRequestRegisteredTimestamp.ms,
  },
} satisfies AI.Events.AiRequestRegisteredEventType;

export const GenericAiQuotaExceededEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `user_ai_usage_${userId}`,
  version: 1,
  name: "AI_QUOTA_EXCEEDED_EVENT",
  payload: { userId, timestamp: aiRequestRegisteredTimestamp.ms },
} satisfies AI.Events.AiQuotaExceededEventType;

export const GenericEntryHistorySituationLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
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
    },
  },
} satisfies bg.History.Events.HistoryPopulatedEventType;

export const GenericEntryHistoryEmotionLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
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
  createdAt: T0.ms,
  stream: `history_${entryId}`,
  version: 1,
  name: "HISTORY_CLEARED_EVENT",
  payload: { subject: entryId },
} satisfies bg.History.Events.HistoryClearedEventType;

export const GenericAccountCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `account_${userId}`,
  version: 1,
  name: "ACCOUNT_CREATED_EVENT",
  payload: { userId, timestamp: T0.ms },
} satisfies Auth.Events.AccountCreatedEventType;

export const GenericUserLanguageSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: SupportedLanguages.en },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericUserLanguageSetPLEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: SupportedLanguages.pl },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericProfileAvatarUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "PROFILE_AVATAR_UPDATED_EVENT",
  payload: { userId, key: objectKey, etag: "noop" },
} satisfies Preferences.Events.ProfileAvatarUpdatedEventType;

export const GenericProfileAvatarRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "PROFILE_AVATAR_REMOVED_EVENT",
  payload: { userId },
} satisfies Preferences.Events.ProfileAvatarRemovedEventType;

export const partialEntry: Emotions.VO.EntrySnapshot = {
  revision: 0,
  startedAt: T0.ms,
  status: Emotions.VO.EntryStatusEnum.actionable,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
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
  startedAt: T0.ms,
  status: Emotions.VO.EntryStatusEnum.actionable,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
  emotionLabel: Emotions.VO.GenevaWheelEmotion.anger,
  emotionIntensity: 5,
  reactionDescription: "Got drunk",
  reactionType: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
  reactionEffectiveness: 1,
  weekIsoId: week.toIsoId(),
  origin: Emotions.VO.EntryOriginOption.web,
  userId,
};

export const fullEntryWithAlarms: Emotions.Ports.EntrySnapshotWithAlarms = {
  ...fullEntry,
  alarms: [] as Emotions.VO.AlarmSnapshot[],
};

export const fullEntryWithAlarmsFormatted: EntrySnapshotFormatted = {
  ...fullEntry,
  alarms: [] as Emotions.VO.AlarmSnapshot[],
  startedAt: tools.DateFormatters.datetime(fullEntry.startedAt),
};

export const timeCapsuleEntry: Emotions.Ports.TimeCapsuleEntrySnapshot = {
  scheduledFor: timeCapsuleEntryScheduledFor.ms,
  id: entryId,
  situationDescription: "I finished a project",
  situationKind: Emotions.VO.SituationKindOptions.achievement,
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
  createdAt: T0.ms,
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
  generatedAt: T0.ms,
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
  id: patternDetectionId,
  createdAt: T0.ms,
  name: Emotions.VO.PatternNameOption.MoreNegativeThanPositiveEmotionsPattern,
  weekIsoId: week.toIsoId(),
  userId,
};

export const shareableLink: Schema.SelectShareableLinks = {
  id: shareableLinkId,
  createdAt: T0.ms,
  updatedAt: T0.ms,
  status: Publishing.VO.ShareableLinkStatusEnum.active,
  revision: 0,
  ownerId: userId,
  publicationSpecification: "entries",
  dateRangeStart: T0.ms,
  dateRangeEnd: T0.ms,
  durationMs: T0.ms,
  expiresAt: T0.ms,
  hidden: false,
};

export const shareableLinkSnapshot: Publishing.VO.ShareableLinkSnapshot = {
  id: shareableLinkId,
  updatedAt: tools.DateFormatters.datetime(T0.ms),
  status: Publishing.VO.ShareableLinkStatusEnum.active,
  revision: 0,
  publicationSpecification: "entries",
  dateRangeStart: tools.DateFormatters.datetime(T0.ms),
  dateRangeEnd: tools.DateFormatters.datetime(T0.ms),
  expiresAt: tools.DateFormatters.datetime(T0.ms),
  hits: 1,
  uniqueVisitors: 1,
};

export const user: User = {
  name: email,
  email: email,
  emailVerified: false,
  image: null,
  createdAt: new Date(T0.ms),
  updatedAt: new Date(T0.ms),
  id: userId,
};

export const anotherUser: User = {
  name: anotherEmail,
  email: anotherEmail,
  emailVerified: false,
  image: null,
  createdAt: new Date(T0.ms),
  updatedAt: new Date(T0.ms),
  id: anotherUserId,
};

export const session: Session = {
  expiresAt: new Date(T0.ms),
  token: "wyNm82TTSvBtxXSh1mb7lZJ4WF557tv4",
  createdAt: new Date(T0.ms),
  updatedAt: new Date(T0.ms),
  ipAddress: "",
  userAgent: "Mozilla/5.0",
  userId,
  id: "JUFCrqCBwFT3MCJV0mAVYSXtLJOkNBVN",
};

export const anotherSession: Session = {
  expiresAt: new Date(T0.ms),
  token: "XFgejTtN28QI8cDEmE9Yb09yxRwQuGj0",
  createdAt: new Date(T0.ms),
  updatedAt: new Date(T0.ms),
  ipAddress: "",
  userAgent: "Mozilla/5.0",
  userId,
  id: "xXHd0LUChE6NiYnQXc8mwij7jjp5kUhs",
};

export const auth = { user, session, path: "/get-session", options: {} as any } as const;

export const anotherAuth = {
  user: anotherUser,
  session: anotherSession,
  path: "/get-session",
  options: {} as any,
} as const;

export const entryCsv = ["id,situationDescription", `${fullEntry.id},${fullEntry.situationDescription}`].join(
  "",
);
export const alarmCsv = ["id,name", `${alarm.id},${alarm.name}`].join("");

export const entryText = `Situation description: ${fullEntry.situationDescription}`;

export const entryMarkdown = `# Situation description: ${fullEntry.situationDescription}`;

const PLACEHOLDER_PDF_BASE64 =
  "JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoK MiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoz IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQy XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9u dCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5 cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1Jv bWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAov RjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhy ZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAw MDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAw MDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVF T0YK";

export const PDF = Buffer.from(PLACEHOLDER_PDF_BASE64, "base64");
