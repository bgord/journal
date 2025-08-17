import hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

export const GetSharedEntries = (EntriesSharing: Emotions.OHQ.EntriesSharingPort) =>
  async function (c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
    const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

    const shareableLinkAccess = await Publishing.OHQ.ShareableLinkAccess.check(shareableLinkId, "entries");

    if (!shareableLinkAccess.valid) return c.json({ _known: true, message: "shareable_link_invalid" }, 403);

    const entries = await EntriesSharing.listForOwnerInRange(
      shareableLinkAccess.details.ownerId,
      shareableLinkAccess.details.dateRange,
    );

    return c.json(entries);
  };
