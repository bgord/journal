import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

type Dependencies = {
  Clock: bg.ClockPort;
  ShareableLinkAccessOHQ: Publishing.OHQ.ShareableLinkAccessAdapter;
  EntriesSharing: Emotions.OHQ.EntriesSharingPort;
};

export const GetSharedEntries = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

  const context = { timestamp: deps.Clock.nowMs(), visitorId: new bg.VisitorIdHashHonoAdapter(c) };

  const shareableLinkAccess = await deps.ShareableLinkAccessOHQ.check(shareableLinkId, "entries", context);

  if (!shareableLinkAccess.valid) return c.json({ _known: true, message: "shareable_link_invalid" }, 403);

  const entries = await deps.EntriesSharing.listForOwnerInRange(
    shareableLinkAccess.details.ownerId,
    shareableLinkAccess.details.dateRange,
  );

  return c.json(entries);
};
