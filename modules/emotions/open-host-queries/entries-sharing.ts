import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

type SharedEntryDto = Omit<VO.EntrySnapshot, "startedAt"> & { startedAt: string } & {
  alarms: ReadonlyArray<VO.AlarmSnapshot>;
};

export interface EntriesSharingPort {
  listForOwnerInRange(
    ownerId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
  ): Promise<ReadonlyArray<SharedEntryDto>>;
}
