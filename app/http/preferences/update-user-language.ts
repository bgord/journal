import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<bg.Preferences.Commands.SetUserLanguageCommandType>;
};

export const UpdateUserLanguage =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const language = v.parse(tools.Language, body["language"]);

    const command = bg.command(
      bg.Preferences.Commands.SetUserLanguageCommand,
      { payload: { userId, language } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
