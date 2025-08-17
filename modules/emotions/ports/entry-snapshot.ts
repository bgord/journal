import type * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export interface EntrySnapshotPort {
  getById(userId: Auth.VO.UserIdType): Promise<VO.EntrySnapshot | undefined>;
}
