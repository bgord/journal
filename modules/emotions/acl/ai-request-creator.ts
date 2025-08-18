import * as tools from "@bgord/tools";
import * as AI from "+ai";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";

export const createWeeklyReviewInsightRequestContext = (
  userId: Auth.VO.UserIdType,
): AI.RequestContext<AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT> => {
  return {
    category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
    userId,
    timestamp: tools.Time.Now().value,
    dimensions: {},
  };
};

/** @public */
export const createEmotionsAlarmEntryRequestContext = (
  userId: Auth.VO.UserIdType,
  entryId: Emotions.VO.EntryIdType,
): AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_ENTRY> => {
  return {
    userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
    timestamp: tools.Time.Now().value,
    dimensions: { entryId },
  };
};

/** @public */
export const createEmotionsAlarmInactivityRequestContext = (
  userId: Auth.VO.UserIdType,
): AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY> => {
  return {
    userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
    timestamp: tools.Time.Now().value,
    dimensions: {},
  };
};

export const createAlarmRequestContext = (
  userId: Auth.VO.UserIdType,
  entryId?: Emotions.VO.EntryIdType,
):
  | AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_ENTRY>
  | AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY> => {
  if (entryId) {
    return {
      userId,
      category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
      timestamp: tools.Time.Now().value,
      dimensions: { entryId },
    };
  }

  return {
    userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
    timestamp: tools.Time.Now().value,
    dimensions: {},
  };
};
