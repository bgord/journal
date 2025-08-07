import * as Auth from "+auth";
import { EventStore } from "+infra/event-store";
import * as Aggregates from "+publishing/aggregates";
import * as VO from "+publishing/value-objects";
import * as tools from "@bgord/tools";

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

export class ShareableLinkAccess {
  static async check(
    id: VO.ShareableLinkIdType,
    publicationSpecification: VO.PublicationSpecificationType,
  ): Promise<ShareableLinkAccessValidType | ShareableLinkAccessInvalidType> {
    const history = await EventStore.find(
      Aggregates.ShareableLink.events,
      Aggregates.ShareableLink.getStream(id),
    );

    if (!history.length) return { valid: false };

    const shareableLink = Aggregates.ShareableLink.build(id, history);

    const valid = shareableLink.isValid(publicationSpecification);

    if (!valid) return { valid: false };

    return { valid: true, details: shareableLink.summarize() };
  }
}
