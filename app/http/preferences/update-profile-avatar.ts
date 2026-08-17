import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Preferences from "+preferences";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Preferences.Commands.UpdateProfileAvatarCommandType>;
  TemporaryFile: bg.TemporaryFilePort;
};

export const UpdateProfileAvatar =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const form = await context.request.form();

    const userId = context.identity.authenticatedUserId();
    const file = v.parse(v.instance(File), form.get("file"));

    const uploaded = tools.Filename.fromString(file.name);
    const filename = uploaded.withBasename(v.parse(tools.Basename, userId));

    const temporary = await deps.TemporaryFile.write(filename, file);

    const command = bg.command(
      Preferences.Commands.UpdateProfileAvatarCommand,
      { payload: { userId, absoluteFilePath: temporary.get() } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
