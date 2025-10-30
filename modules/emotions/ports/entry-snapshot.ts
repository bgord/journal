import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

/** @public */
export type EntrySnapshotWithAlarms = VO.EntrySnapshot & { alarms: VO.AlarmSnapshot[] };

export type EntrySnapshotWithAlarmsFormatted = Omit<EntrySnapshotWithAlarms, "startedAt"> & {
  startedAt: string;
};

export interface EntrySnapshotPort {
  getById(entryId: VO.EntryIdType): Promise<VO.EntrySnapshot | undefined>;

  getByWeekForUser(week: tools.Week, userId: Auth.VO.UserIdType): Promise<VO.EntrySnapshot[]>;

  getAllForuser(userId: Auth.VO.UserIdType): Promise<VO.EntrySnapshot[]>;

  getByDateRangeForUser(userId: Auth.VO.UserIdType, dateRange: tools.DateRange): Promise<VO.EntrySnapshot[]>;

  getByDateRangeForUserWithAlarms(
    userId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
    query: string,
  ): Promise<EntrySnapshotWithAlarms[]>;
}
