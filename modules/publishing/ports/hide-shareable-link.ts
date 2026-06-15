import type * as Auth from "+auth";
import type * as VO from "+publishing/value-objects";

export interface HideShareableLink {
  hide(id: VO.ShareableLinkIdType, userId: Auth.VO.UserIdType): Promise<void>;
}
