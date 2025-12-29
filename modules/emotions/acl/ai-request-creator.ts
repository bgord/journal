import type * as bg from "@bgord/bun";
import * as AI from "+ai";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";

type Dependencies = { Clock: bg.ClockPort };

export const createWeeklyReviewInsightRequestContext = (
  deps: Dependencies,
  userId: Auth.VO.UserIdType,
): AI.RequestContext<AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT> => {
  return {
    category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
    userId,
    timestamp: deps.Clock.now().ms,
    dimensions: {},
  };
};

/** @public */
export const createEmotionsAlarmEntryRequestContext = (
  deps: Dependencies,
  userId: Auth.VO.UserIdType,
  entryId: Emotions.VO.EntryIdType,
): AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_ENTRY> => {
  return {
    userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
    timestamp: deps.Clock.now().ms,
    dimensions: { entryId },
  };
};

/** @public */
export const createEmotionsAlarmInactivityRequestContext = (
  deps: Dependencies,
  userId: Auth.VO.UserIdType,
): AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY> => {
  return {
    userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
    timestamp: deps.Clock.now().ms,
    dimensions: {},
  };
};

export const createAlarmRequestContext = (
  deps: Dependencies,
  userId: Auth.VO.UserIdType,
  entryId?: Emotions.VO.EntryIdType,
):
  | AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_ENTRY>
  | AI.RequestContext<AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY> => {
  if (entryId) {
    return {
      userId,
      category: AI.UsageCategory.EMOTIONS_ALARM_ENTRY,
      timestamp: deps.Clock.now().ms,
      dimensions: { entryId },
    };
  }

  return {
    userId,
    category: AI.UsageCategory.EMOTIONS_ALARM_INACTIVITY,
    timestamp: deps.Clock.now().ms,
    dimensions: {},
  };
};
