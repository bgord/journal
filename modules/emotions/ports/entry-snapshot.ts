import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export interface EntrySnapshotPort {
  getById(entryId: VO.EntryIdType): Promise<VO.EntrySnapshot | undefined>;

  getByWeekForUser(week: tools.Week, userId: Auth.VO.UserIdType): Promise<VO.EntrySnapshot[]>;

  getAllForuser(userId: Auth.VO.UserIdType): Promise<VO.EntrySnapshot[]>;
}
