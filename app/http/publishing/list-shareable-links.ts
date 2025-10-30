import type hono from "hono";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = { ShareableLinkSnapshot: Adapters.Publishing.ShareableLinkSnapshot };

export async function ListShareableLinks(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;
  const timeZoneOffsetMs = c.get("timeZoneOffset").ms;

  const shareableLinks = await deps.ShareableLinkSnapshot.getByUserId(userId, timeZoneOffsetMs);

  return c.json(shareableLinks);
}
