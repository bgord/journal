import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import * as Adapters from "+infra/adapters";

const deps = {
  Clock: Adapters.Clock,
  ShareableLinkAccess: Adapters.Publishing.ShareableLinkAccess,
};

export async function GetSharedEntries(c: hono.Context<infra.HonoConfig>) {
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

  const context = { timestamp: deps.Clock.nowMs(), visitorId: new bg.VisitorIdHashHonoAdapter(c) };

  const shareableLinkAccess = await deps.ShareableLinkAccess.check(shareableLinkId, "entries", context);

  if (!shareableLinkAccess.valid) return c.json({ _known: true, message: "shareable_link_invalid" }, 403);

  const entries = await Adapters.Emotions.EntriesSharing.listForOwnerInRange(
    shareableLinkAccess.details.ownerId,
    shareableLinkAccess.details.dateRange,
  );

  return c.json(entries);
}
