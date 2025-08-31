import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import * as Adapters from "+infra/adapters";

export async function GetSharedEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

  const context = {
    timestamp: Adapters.Clock.nowMs(),
    visitorId: new bg.VisitorIdHashHono(c),
  };

  const shareableLinkAccess = await Adapters.Publishing.ShareableLinkAccess.check(
    shareableLinkId,
    "entries",
    context,
  );

  if (!shareableLinkAccess.valid) return c.json({ _known: true, message: "shareable_link_invalid" }, 403);

  const entries = await Adapters.Emotions.EntriesSharing.listForOwnerInRange(
    shareableLinkAccess.details.ownerId,
    shareableLinkAccess.details.dateRange,
  );

  return c.json(entries);
}
