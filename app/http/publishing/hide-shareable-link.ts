import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Publishing from "+publishing";

type Dependencies = { HideShareableLink: Publishing.Ports.HideShareableLink };

export const HideShareableLink = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();

  const userId = context.identity.userId() as bg.UUIDType;
  const shareableLinkId = v.parse(Publishing.VO.ShareableLinkId, params["shareableLinkId"]);

  await deps.HideShareableLink.hide(shareableLinkId, userId);

  return new Response();
};
