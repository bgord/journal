import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import type * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ShareableLinkSnapshot: Publishing.Ports.ShareableLinkSnapshotPort;
};

export const ListShareableLinks = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);

  const userId = context.identity.userId() as bg.UUIDType;
  const timeZoneOffset = context.middleware.timeZoneOffset();

  const shareableLinks = await deps.ShareableLinkSnapshot.getByUserId(userId, timeZoneOffset);

  return Response.json(shareableLinks);
};
