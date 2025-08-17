import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export interface EntrySnapshotPort {
  getById(userId: VO.EntryIdType): Promise<VO.EntrySnapshot | undefined>;

  getByWeekForUser(week: tools.Week, userId: Auth.VO.UserIdType): Promise<VO.EntrySnapshot[]>;
}
