import path from "node:path";
import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import { CommandBus } from "+infra/command-bus";

// TODO Filename VO
export async function UpdateProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  const userId = "xxx";
  const body = await c.req.formData();
  const file = body.get("file") as File;

  const current = path.parse(file.name);
  // TODO add dir to prereq
  const temporary = `infra/profile-avatars/${userId}${current.ext}`;

  await Bun.write(temporary, file);

  const command = Preferences.Commands.UpdateProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(),
    name: Preferences.Commands.UPDATE_PROFILE_AVATAR_COMMAND,
    payload: { userId: userId, extension: current.ext },
  } satisfies Preferences.Commands.UpdateProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
