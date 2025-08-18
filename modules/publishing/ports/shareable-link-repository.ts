import type { ShareableLink } from "+publishing/aggregates";
import type * as VO from "+publishing/value-objects";

export interface ShareableLinkRepositoryPort {
  load(id: VO.ShareableLinkIdType): Promise<ShareableLink>;
  save(aggregate: ShareableLink): Promise<void>;
}
