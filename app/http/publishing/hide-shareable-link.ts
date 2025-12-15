import { and, eq } from "drizzle-orm";
import type hono from "hono";
import type * as infra from "+infra";
import * as Publishing from "+publishing";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const HideShareableLink = () => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const shareableLinkId = Publishing.VO.ShareableLinkId.parse(c.req.param("shareableLinkId"));

  await db
    .update(Schema.shareableLinks)
    .set({ hidden: true })
    .where(
      and(
        eq(Schema.shareableLinks.id, shareableLinkId),
        eq(Schema.shareableLinks.ownerId, userId),
        eq(Schema.shareableLinks.hidden, false),
      ),
    );

  return new Response();
};
