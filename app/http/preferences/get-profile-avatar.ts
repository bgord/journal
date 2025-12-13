import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import * as Adapters from "+infra/adapters";

const deps = { RemoteFileStorage: Adapters.RemoteFileStorage };

export async function GetProfileAvatar(c: hono.Context<infra.Config>) {
  const user = c.get("user");

  const key = Preferences.VO.ProfileAvatarKeyFactory.stable(user.id);

  const head = await deps.RemoteFileStorage.head(key);
  if (!head.exists) return c.notFound();

  const ifNoneMatchHeader = c.req.header("if-none-match");

  if (ifNoneMatchHeader && ifNoneMatchHeader === head.etag) {
    return bg.CacheFileMustRevalidate.notModified(head);
  }

  const stream = await deps.RemoteFileStorage.getStream(key);
  if (!stream) return c.notFound();

  return new Response(stream, { headers: bg.CacheFileMustRevalidate.fresh(head) });
}
