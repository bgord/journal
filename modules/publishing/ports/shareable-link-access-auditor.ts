import type * as Auth from "+auth";
import type * as VO from "+publishing/value-objects";

export interface ShareableLinkAccessAuditorPort {
  record(input: {
    linkId: VO.ShareableLinkIdType;
    ownerId: Auth.VO.UserIdType;
    validity: VO.AccessValidity;
    reason: string;
    context: VO.AccessContext;
  }): Promise<void>;
}
