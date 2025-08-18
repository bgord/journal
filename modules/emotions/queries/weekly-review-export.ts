import type * as VO from "+emotions/value-objects";

export type WeeklyReviewExportDto = VO.WeeklyReviewSnapshot & {
  entries: Pick<
    VO.EntrySnapshot,
    | "id"
    | "situationDescription"
    | "situationLocation"
    | "situationKind"
    | "emotionLabel"
    | "emotionIntensity"
    | "reactionDescription"
    | "reactionType"
    | "reactionEffectiveness"
    | "startedAt"
  >[];
  patternDetections: Pick<VO.PatternDetectionSnapshot, "id" | "name">[];
  alarms: Pick<
    VO.AlarmSnapshot,
    | "id"
    | "name"
    | "advice"
    | "generatedAt"
    | "inactivityDays"
    | "lastEntryTimestamp"
    | "emotionLabel"
    | "emotionIntensity"
  >[];
};

export interface WeeklyReviewExport {
  getFull(id: VO.WeeklyReviewIdType): Promise<WeeklyReviewExportDto | undefined>;
}
