import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<bg.Preferences.Commands.SetUserLanguageCommandType>;
};

export const UpdateUserLanguage = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await c.req.json();

  const command = bg.command(
    bg.Preferences.Commands.SetUserLanguageCommand,
    { payload: { userId, language: body.language } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
