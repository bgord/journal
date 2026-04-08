import type * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import type * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ShareableLinkSnapshot: Publishing.Ports.ShareableLinkSnapshotPort;
};

export const ListShareableLinks = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const timeZoneOffset = c.get("timeZoneOffset");

  const shareableLinks = await deps.ShareableLinkSnapshot.getByUserId(userId, timeZoneOffset);

  return c.json(shareableLinks);
};
