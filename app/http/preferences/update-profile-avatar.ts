import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import { CommandBus } from "+infra/command-bus";
import { temporaryFile } from "+infra/temporary-file.adapter";

export async function UpdateProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  // const user = c.get("user"); // below is for local test only
  const userId = crypto.randomUUID();
  const body = await c.req.formData();
  const file = body.get("file") as File;

  const uploaded = tools.Filename.fromString(file.name);
  const filename = uploaded.withBasename(tools.BasenameSchema.parse(userId)).withSuffix("-temp");

  const temporary = await temporaryFile.write(filename, file);

  const command = Preferences.Commands.UpdateProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(),
    name: Preferences.Commands.UPDATE_PROFILE_AVATAR_COMMAND,
    payload: { userId: userId, absoluteFilePath: temporary.path.get() },
  } satisfies Preferences.Commands.UpdateProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
