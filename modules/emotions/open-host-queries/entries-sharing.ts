import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type { EntrySnapshotFormatted } from "+emotions/ports";

export interface EntriesSharingPort {
  listForOwnerInRange(
    ownerId: Auth.VO.UserIdType,
    dateRange: tools.DateRange,
  ): Promise<ReadonlyArray<EntrySnapshotFormatted>>;
}
