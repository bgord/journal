import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { CommandBus } from "+infra/command-bus";
import { TemporaryFile } from "+infra/temporary-file.adapter";

export async function UpdateProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  const user = c.get("user");
  const body = await c.req.formData();
  const file = body.get("file") as File;

  const uploaded = tools.Filename.fromString(file.name);
  const filename = uploaded.withBasename(tools.BasenameSchema.parse(user.id));

  const temporary = await TemporaryFile.write(filename, file);

  const command = Preferences.Commands.UpdateProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(IdProvider),
    name: Preferences.Commands.UPDATE_PROFILE_AVATAR_COMMAND,
    payload: { userId: user.id, absoluteFilePath: temporary.path.get() },
  } satisfies Preferences.Commands.UpdateProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
