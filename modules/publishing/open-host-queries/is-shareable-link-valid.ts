import { EventStore } from "+infra/event-store";
import * as Aggregates from "+publishing/aggregates";
import * as VO from "+publishing/value-objects";

export async function isShareableLinkValid(id: VO.ShareableLinkIdType): Promise<boolean> {
  const history = await EventStore.find(
    Aggregates.ShareableLink.events,
    Aggregates.ShareableLink.getStream(id),
  );

  if (!history.length) return false;

  return Aggregates.ShareableLink.build(id, history).isValid();
}
