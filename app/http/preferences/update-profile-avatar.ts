import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { TemporaryFile } from "+infra/temporary-file.adapter";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function UpdateProfileAvatar(c: hono.Context<infra.Config>) {
  const userId = c.get("user").id;
  const body = await c.req.formData();
  const file = body.get("file") as File;

  const uploaded = tools.Filename.fromString(file.name);
  const filename = uploaded.withBasename(tools.Basename.parse(userId));

  const temporary = await TemporaryFile.write(filename, file);

  const command = Preferences.Commands.UpdateProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Preferences.Commands.UPDATE_PROFILE_AVATAR_COMMAND,
    payload: { userId, absoluteFilePath: temporary.path.get() },
  } satisfies Preferences.Commands.UpdateProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
