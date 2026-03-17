import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<bg.Preferences.Commands.SetUserLanguageCommandType>;
};

export const UpdateUserLanguage = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await c.req.json();

  const command = v.parse(bg.Preferences.Commands.SetUserLanguageCommand, {
    ...bg.createCommandEnvelope(deps),
    name: bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
    payload: { userId, language: body.language },
  } satisfies bg.Preferences.Commands.SetUserLanguageCommandType);

  await deps.CommandBus.emit(command);

  return new Response();
};
