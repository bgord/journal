import type * as tools from "@bgord/tools";
import type * as VO from "+publishing/value-objects";

export type ExpiringShareableLink = { id: VO.ShareableLinkIdType; revision: tools.RevisionValueType };

export interface ExpiringShareableLinksPort {
  listDue(now: tools.TimestampValueType): Promise<ReadonlyArray<ExpiringShareableLink>>;
}
