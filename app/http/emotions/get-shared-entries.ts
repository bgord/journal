import hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import { EntriesSharing } from "+infra/adapters/emotions";

export async function GetSharedEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

  const shareableLinkAccess = await Publishing.OHQ.ShareableLinkAccess.check(shareableLinkId, "entries");

  if (!shareableLinkAccess.valid) return c.json({ _known: true, message: "shareable_link_invalid" }, 403);

  const entries = await EntriesSharing.listForOwnerInRange(
    shareableLinkAccess.details.ownerId,
    shareableLinkAccess.details.dateRange,
  );

  return c.json(entries);
}
