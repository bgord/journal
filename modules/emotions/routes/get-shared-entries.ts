import type * as infra from "+infra";
import * as Publishing from "+publishing";
import hono from "hono";

export async function GetSharedEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

  const shareableLinkAccess = await Publishing.OHQ.ShareableLinkAccess.check(shareableLinkId, user.id);

  if (!shareableLinkAccess.valid) {
    return c.json({ _known: true, message: "shareable_link_invalid" }, 403);
  }

  return new Response();
}
