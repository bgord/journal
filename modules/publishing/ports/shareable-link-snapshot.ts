import type * as VO from "+publishing/value-objects";

export interface ShareableLinkSnapshotPort {
  getByUserId(id: VO.ShareableLinkIdType): Promise<VO.ShareableLinkSnapshot[]>;
}
