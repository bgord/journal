import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import hono from "hono";

export async function GetSharedEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

  const shareableLinkAccess = await Publishing.OHQ.ShareableLinkAccess.check(shareableLinkId, "entries");

  if (!shareableLinkAccess.valid) return c.json({ _known: true, message: "shareable_link_invalid" }, 403);

  const entries = Emotions.Repos.EntryRepository.listShared(shareableLinkAccess);

  return c.json(entries);
}
