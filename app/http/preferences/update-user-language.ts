import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import { SUPPORTED_LANGUAGES } from "+languages";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<bg.Preferences.Commands.SetUserLanguageCommandType>;
};

export const UpdateUserLanguage = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const body = await c.req.json();
  const language = new bg.Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES).ensure(body.language);

  const command = bg.Preferences.Commands.SetUserLanguageCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
    payload: { userId, language },
  } satisfies bg.Preferences.Commands.SetUserLanguageCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response();
};
