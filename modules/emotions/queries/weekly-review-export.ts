import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export type WeeklyReviewExportDtoEntryFields =
  | "id"
  | "situationDescription"
  | "situationKind"
  | "emotionLabel"
  | "emotionIntensity"
  | "reactionDescription"
  | "reactionType"
  | "reactionEffectiveness"
  | "startedAt";

export type WeeklyReviewExportDtoAlarmFields =
  | "id"
  | "name"
  | "advice"
  | "generatedAt"
  | "inactivityDays"
  | "lastEntryTimestamp"
  | "emotionLabel"
  | "emotionIntensity";

export type WeeklyReviewExportDtoPatternDetectionFields = "id" | "name";

export type WeeklyReviewExportDto = VO.WeeklyReviewSnapshot & {
  entries: Pick<VO.EntrySnapshot, WeeklyReviewExportDtoEntryFields>[];
  patternDetections: Pick<VO.PatternDetectionSnapshot, WeeklyReviewExportDtoPatternDetectionFields>[];
  alarms: Pick<VO.AlarmSnapshot, WeeklyReviewExportDtoAlarmFields>[];
};

export interface WeeklyReviewExport {
  getFull(id: VO.WeeklyReviewIdType): Promise<WeeklyReviewExportDto | undefined>;

  listFull(userId: Auth.VO.UserIdType, limit: number): Promise<WeeklyReviewExportDto[]>;
}
