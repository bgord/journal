import type * as tools from "@bgord/tools";
import type * as VO from "+publishing/value-objects";

export interface ShareableLinkSnapshotPort {
  getByUserId(
    id: VO.ShareableLinkIdType,
    timeZoneOffset: tools.Duration,
  ): Promise<ReadonlyArray<VO.ShareableLinkSnapshot>>;
}
