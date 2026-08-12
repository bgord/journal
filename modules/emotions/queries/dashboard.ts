import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export type DashboardHeatmapDto = ReadonlyArray<{
  emotionLabel: VO.GenevaWheelEmotion;
  emotionIntensity: VO.EmotionIntensityType;
}>;

/* advice/emotionLabel are non-null here: the queries filter them out in SQL */
export type DashboardAlarmInactivityDto = Pick<VO.AlarmSnapshot, "id" | "generatedAt" | "inactivityDays"> & {
  advice: NonNullable<VO.AlarmSnapshot["advice"]>;
};

export type DashboardAlarmEntryDto = Pick<VO.AlarmSnapshot, "id" | "generatedAt" | "name"> & {
  advice: NonNullable<VO.AlarmSnapshot["advice"]>;
  emotionLabel: NonNullable<VO.AlarmSnapshot["emotionLabel"]>;
};

export type DashboardTopReactionDto = Pick<VO.EntrySnapshot, "id"> & {
  reactionDescription: NonNullable<VO.EntrySnapshot["reactionDescription"]>;
  reactionType: NonNullable<VO.EntrySnapshot["reactionType"]>;
  reactionEffectiveness: NonNullable<VO.EntrySnapshot["reactionEffectiveness"]>;
};

export type DashboardTopEmotionDto = {
  id: VO.EntryIdType;
  emotionLabel: VO.GenevaWheelEmotion;
  hits: tools.IntegerNonNegativeType;
};

export type DashboardDto = {
  heatmap: DashboardHeatmapDto;
  alarms: {
    inactivity: ReadonlyArray<DashboardAlarmInactivityDto>;
    entry: ReadonlyArray<DashboardAlarmEntryDto>;
  };
  entries: {
    counts: {
      today: tools.IntegerNonNegativeType;
      lastWeek: tools.IntegerNonNegativeType;
      allTime: tools.IntegerNonNegativeType;
    };
    top: {
      reactions: ReadonlyArray<DashboardTopReactionDto>;
      emotions: {
        today: ReadonlyArray<DashboardTopEmotionDto>;
        lastWeek: ReadonlyArray<DashboardTopEmotionDto>;
        allTime: ReadonlyArray<DashboardTopEmotionDto>;
      };
    };
  };
};

export interface Dashboard {
  get(userId: Auth.VO.UserIdType, now: tools.Timestamp): Promise<DashboardDto>;
}
