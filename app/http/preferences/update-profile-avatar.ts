import path from "node:path";
import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import { CommandBus } from "+infra/command-bus";

// TODO Filename VO to @bgord/bun?
export async function UpdateProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  const userId = "xxx";
  const body = await c.req.formData();
  const file = body.get("file") as File;

  const current = path.parse(file.name);
  // TODO add the dir to prerequisites
  const temporary = `infra/profile-avatars/${userId}${current.ext}`;

  // TODO: extract to an adapter - reusable part that will be used to bgord/bun
  await Bun.write(temporary, file);

  const command = Preferences.Commands.UpdateProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(),
    name: Preferences.Commands.UPDATE_PROFILE_AVATAR_COMMAND,
    payload: { userId: userId, extension: current.ext },
  } satisfies Preferences.Commands.UpdateProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
