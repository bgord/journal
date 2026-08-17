import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Publishing from "+publishing";

type Dependencies = { HideShareableLink: Publishing.Ports.HideShareableLink };

export const HideShareableLink = (deps: Dependencies):bg.EndpointPort => async (context) => {
  const params = context.request.params();

  const userId = context.identity.authenticatedUserId();
  const shareableLinkId = v.parse(Publishing.VO.ShareableLinkId, params["shareableLinkId"]);

  await deps.HideShareableLink.hide(shareableLinkId, userId);

  return new Response();
};
