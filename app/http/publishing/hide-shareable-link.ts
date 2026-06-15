import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

type Dependencies = { HideShareableLink: Publishing.Ports.HideShareableLink };

export const HideShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const shareableLinkId = v.parse(Publishing.VO.ShareableLinkId, c.req.param("shareableLinkId"));

  await deps.HideShareableLink.hide(shareableLinkId, userId);

  return new Response();
};
