import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import { RemoteFileStorage } from "+infra/adapters/remote-file-storage";

export async function GetProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  const user = c.get("user");

  const key = Preferences.VO.ProfileAvatarKeyFactory.stable(user.id);

  const head = await RemoteFileStorage.head(key);
  if (!head.exists) return c.notFound();

  const ifNoneMatchHeader = c.req.header("if-none-match");

  if (ifNoneMatchHeader && ifNoneMatchHeader === head.etag) {
    return new Response(null, {
      status: 304,
      headers: new Headers({
        ETag: head.etag,
        "Cache-Control": "private, max-age=0, must-revalidate",
        "Last-Modified": new Date(head.lastModified).toUTCString(),
        Vary: "Authorization, Cookie",
      }),
    });
  }

  const stream = await RemoteFileStorage.getStream(key);
  if (!stream) return c.notFound();

  const headers = new Headers({
    "Content-Type": head.mime.raw,
    "Cache-Control": "private, max-age=0, must-revalidate",
    ETag: head.etag,
    "Content-Length": head.size.toBytes().toString(),
    "Last-Modified": new Date(head.lastModified).toUTCString(),
    "Accept-Ranges": "bytes",
    Vary: "Authorization, Cookie",
  });

  return new Response(stream, { status: 200, headers });
}
