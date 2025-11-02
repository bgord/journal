import type * as tools from "@bgord/tools";
import type * as VO from "+publishing/value-objects";

type ExpiringShareableLink = { id: VO.ShareableLinkIdType; revision: tools.RevisionValueType };

export interface ExpiringShareableLinksPort {
  listDue(now: tools.TimestampVO): Promise<ExpiringShareableLink[]>;
}
