import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export type EntrySnapshotWithAlarms = VO.EntrySnapshot & { alarms: ReadonlyArray<VO.AlarmSnapshot> };

export type EntrySnapshotFormatted = Omit<EntrySnapshotWithAlarms, "startedAt"> & {
  startedAt: string;
};

export type EntryListPage = bg.Page<EntrySnapshotWithAlarms, VO.EntryListCursorType>;

export type EntryListPageConfig = {
  cursor?: VO.EntryListCursorType;
  limit: tools.IntegerPositiveType;
};

export type EntryList = { data: EntryListPage; count: tools.IntegerNonNegativeType };

export interface EntrySnapshotPort {
  getById(entryId: VO.EntryIdType): Promise<VO.EntrySnapshot | undefined>;

  getByWeekForUser(week: tools.Week, userId: Auth.VO.UserIdType): Promise<ReadonlyArray<VO.EntrySnapshot>>;

  getAllForUser(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<VO.EntrySnapshot>>;

  getByDateRangeForUser(
    userId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
  ): Promise<ReadonlyArray<VO.EntrySnapshot>>;

  getFormatted(
    userId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
    query: string,
    config: EntryListPageConfig,
  ): Promise<EntryList>;
}
