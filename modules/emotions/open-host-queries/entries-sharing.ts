import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export type SharedEntryDto = Omit<VO.EntrySnapshot, "startedAt"> & { startedAt: string } & {
  alarms: VO.AlarmSnapshot[];
};

export interface EntriesSharingPort {
  listForOwnerInRange(ownerId: Auth.VO.UserIdType, dateRange: tools.DateRange): Promise<SharedEntryDto[]>;
}
