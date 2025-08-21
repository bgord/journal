import type * as Auth from "+auth";
import type * as VO from "+publishing/value-objects";

export type ShareableLinkAccessAuditorInput = {
  linkId: VO.ShareableLinkIdType;
  ownerId: Auth.VO.UserIdType;
  validity: VO.AccessValidity;
  publicationSpecification: VO.PublicationSpecificationType;
  reason: string;
  context: VO.AccessContext;
};

export interface ShareableLinkAccessAuditorPort {
  record(input: ShareableLinkAccessAuditorInput): Promise<void>;
}
