import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+publishing/value-objects";

export type ShareableLinkAccessValidType = {
  valid: true;
  details: {
    ownerId: Auth.VO.UserIdType;
    publicationSpecification: VO.PublicationSpecificationType;
    dateRange: tools.DateRange;
  };
};

/** @public */
export type ShareableLinkAccessInvalidType = {
  valid: false;
};

export interface ShareableLinkAccessPort {
  check(
    id: VO.ShareableLinkIdType,
    publicationSpecification: VO.PublicationSpecificationType,
  ): Promise<ShareableLinkAccessValidType | ShareableLinkAccessInvalidType>;
}
