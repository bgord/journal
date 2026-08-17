import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";

type Dependencies = { RemoteFileStorage: bg.RemoteFileStoragePort };

export const GetProfileAvatar = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const headers = context.request.headers();

  const userId = context.identity.userId() as bg.UUIDType;

  const key = Preferences.VO.ProfileAvatarKeyFactory.stable(userId);

  const head = await deps.RemoteFileStorage.head(key);
  if (!head.exists) return new Response(null, { status: 404 });

  const ifNoneMatchHeader = headers.get("if-none-match");

  if (ifNoneMatchHeader && bg.Hash.fromString(ifNoneMatchHeader).matches(head.etag)) {
    return bg.CacheFileMustRevalidate.notModified(head);
  }

  const stream = await deps.RemoteFileStorage.getStream(key);
  if (!stream) return new Response(null, { status: 404 });

  return new Response(stream, { headers: bg.CacheFileMustRevalidate.fresh(head) });
};
