import * as bg from "@bgord/bun";
import type * as Publishing from "+publishing";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ShareableLinkSnapshot: Publishing.Ports.ShareableLinkSnapshotPort;
};

export const ListShareableLinks = (deps: Dependencies):bg.EndpointPort => async (context) => {

  const userId = context.identity.authenticatedUserId();
  const timeZoneOffset = context.middleware.timeZoneOffset();

  const shareableLinks = await deps.ShareableLinkSnapshot.getByUserId(userId, timeZoneOffset);

  return Response.json(shareableLinks);
};
