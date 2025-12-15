import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Preferences.Commands.UpdateProfileAvatarCommandType>;
  TemporaryFile: bg.TemporaryFilePort;
};

export const UpdateProfileAvatar = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await c.req.formData();
  const file = body.get("file") as File;

  const uploaded = tools.Filename.fromString(file.name);
  const filename = uploaded.withBasename(tools.Basename.parse(userId));

  const temporary = await deps.TemporaryFile.write(filename, file);

  const command = Preferences.Commands.UpdateProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Preferences.Commands.UPDATE_PROFILE_AVATAR_COMMAND,
    payload: { userId, absoluteFilePath: temporary.path.get() },
  } satisfies Preferences.Commands.UpdateProfileAvatarCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
