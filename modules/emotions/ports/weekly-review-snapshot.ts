import * as VO from "+emotions/value-objects";

export type WeeklyReviewSnapshot = Pick<VO.WeeklyReviewSnapshot, "id" | "userId" | "status">;

export interface WeeklyReviewSnapshotPort {
  getById(id: VO.WeeklyReviewIdType): Promise<WeeklyReviewSnapshot | null>;
}
