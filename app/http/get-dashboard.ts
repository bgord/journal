// Stryker disable all
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  Clock: bg.ClockPort;
  WeeklyReviewExportQuery: Emotions.Queries.WeeklyReviewExport;
  DashboardQuery: Emotions.Queries.Dashboard;
};

type DashboardAlarmInactivityType = Omit<Emotions.Queries.DashboardAlarmInactivityDto, "generatedAt"> & {
  generatedAt: string;
};

type DashboardAlarmEntryType = Omit<Emotions.Queries.DashboardAlarmEntryDto, "generatedAt"> & {
  generatedAt: string;
};

type DashboardTopReactionType = Emotions.Queries.DashboardTopReactionDto;

type DashboardTopEmotionType = Emotions.Queries.DashboardTopEmotionDto;

type DashboardWeeklyReviewType = Emotions.Queries.WeeklyReviewExportDto & {
  weekStart: string;
  weekEnd: string;
};

export type DashboardDataType = {
  heatmap: ReadonlyArray<{ t: 0 | 1; c: "200" | "400" | "600" }>;
  alarms: {
    inactivity: ReadonlyArray<DashboardAlarmInactivityType>;
    entry: ReadonlyArray<DashboardAlarmEntryType>;
  };
  entries: {
    counts: {
      today: tools.IntegerNonNegativeType;
      lastWeek: tools.IntegerNonNegativeType;
      allTime: tools.IntegerNonNegativeType;
    };
    top: {
      reactions: ReadonlyArray<DashboardTopReactionType>;
      emotions: {
        today: ReadonlyArray<DashboardTopEmotionType>;
        lastWeek: ReadonlyArray<DashboardTopEmotionType>;
        allTime: ReadonlyArray<DashboardTopEmotionType>;
      };
    };
  };
  weeklyReviews: ReadonlyArray<DashboardWeeklyReviewType>;
};

export const GetDashboard = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);

  const userId = context.identity.authenticatedUserId();

  const dashboard = await deps.DashboardQuery.get(userId, deps.Clock.now());
  const weeklyReviews = await deps.WeeklyReviewExportQuery.listFull(userId, tools.Int.positive(5));

  const result: DashboardDataType = {
    heatmap: dashboard.heatmap.map((row) => {
      const label = new Emotions.VO.EmotionLabel(row.emotionLabel);
      const intensity = new Emotions.VO.EmotionIntensity(row.emotionIntensity);

      return {
        t: label.isPositive() ? 1 : 0,
        c: intensity.isExtreme() ? "600" : intensity.isIntensive() ? "400" : "200",
      };
    }),
    alarms: {
      inactivity: dashboard.alarms.inactivity.map((alarm) => ({
        ...alarm,
        generatedAt: tools.DateFormatter.datetime(tools.Timestamp.fromNumber(alarm.generatedAt)),
      })),
      entry: dashboard.alarms.entry.map((alarm) => ({
        ...alarm,
        generatedAt: tools.DateFormatter.datetime(tools.Timestamp.fromNumber(alarm.generatedAt)),
      })),
    },
    entries: {
      counts: dashboard.entries.counts,
      top: {
        reactions: dashboard.entries.top.reactions,
        emotions: dashboard.entries.top.emotions,
      },
    },
    weeklyReviews: weeklyReviews.map((review) => ({
      ...review,
      weekStart: tools.DateFormatter.date(tools.Week.fromIsoId(review.weekIsoId).getStart()),
      weekEnd: tools.DateFormatter.date(tools.Week.fromIsoId(review.weekIsoId).getEnd()),
    })),
  };

  return Response.json(result);
};
// Stryker restore all
