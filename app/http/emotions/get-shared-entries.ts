import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Emotions from "+emotions";
import * as Publishing from "+publishing";

type Dependencies = {
  Clock: bg.ClockPort;
  HashContent: bg.HashContentStrategy;
  ShareableLinkAccessOHQ: Publishing.OHQ.ShareableLinkAccessAdapter;
  EntriesSharing: Emotions.OHQ.EntriesSharingPort;
};

export const GetSharedEntries =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const shareableLinkId = v.parse(Publishing.VO.ShareableLinkId, params["shareableLinkId"]);
    const client = bg.Client.fromParts(context.identity.ip(), context.identity.ua());

    const shareableLinkAccess = await deps.ShareableLinkAccessOHQ.check(shareableLinkId, "entries", {
      timestamp: deps.Clock.now().ms,
      visitorId: await new bg.VisitorIdClientStrategy(client, deps).get(),
    });

    if (!shareableLinkAccess.valid) {
      return Response.json({ message: "shareable_link_invalid" }, { status: 403 });
    }

    const entries = await deps.EntriesSharing.listForOwnerInRange(
      shareableLinkAccess.details.ownerId,
      shareableLinkAccess.details.dateRange,
    );

    return Response.json(entries);
  };
