import * as Auth from "+auth";
import { EventStore } from "+infra/event-store";
import * as Aggregates from "+publishing/aggregates";
import * as VO from "+publishing/value-objects";
import * as tools from "@bgord/tools";

type ShareableLinkValidType = {
  valid: true;
  details: { publicationSpecification: VO.PublicationSpecificationType; dateRange: tools.DateRange };
};

type ShareableLinkInvalidType = {
  valid: false;
};

export async function isShareableLinkValid(
  id: VO.ShareableLinkIdType,
  requesterId: Auth.VO.UserIdType,
): Promise<ShareableLinkValidType | ShareableLinkInvalidType> {
  const history = await EventStore.find(
    Aggregates.ShareableLink.events,
    Aggregates.ShareableLink.getStream(id),
  );

  if (!history.length) return { valid: false };

  const shareableLink = Aggregates.ShareableLink.build(id, history);

  const valid = shareableLink.isValid(requesterId);

  if (!valid) return { valid: false };

  return { valid: true, details: shareableLink.summarize() };
}
