import type * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export type WeeklyReviewSnapshot = {
  id: VO.WeeklyReviewIdType;
  userId: Auth.VO.UserIdType;
  status: VO.WeeklyReviewStatusEnum;
};

export interface WeeklyReviewSnapshotPort {
  getById(id: VO.WeeklyReviewIdType): Promise<WeeklyReviewSnapshot | null>;
}
