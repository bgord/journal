import path from "node:path";
import type hono from "hono";
import type * as infra from "+infra";

// TODO Filename VO
export async function UpdateProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  const userId = "xxx";
  const body = await c.req.formData();
  const file = body.get("file") as File;

  const current = path.parse(file.name);
  const temporary = `infra/profile-avatars/${userId}${current.ext}`;

  await Bun.write(temporary, file);

  return new Response();
}
