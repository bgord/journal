import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+publishing/value-objects";

export interface ShareableLinkSnapshotPort {
  getByUserId(
    userId: Auth.VO.UserIdType,
    timeZoneOffset: tools.Duration,
  ): Promise<ReadonlyArray<VO.ShareableLinkSnapshot>>;
}
