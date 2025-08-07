import * as Auth from "+auth";
import { EventStore } from "+infra/event-store";
import * as Aggregates from "+publishing/aggregates";
import * as VO from "+publishing/value-objects";

type ShareableLinkValidType = {
  valid: true;
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

  const valid = Aggregates.ShareableLink.build(id, history).isValid(requesterId);

  return { valid };
}
