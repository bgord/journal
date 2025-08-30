import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import { SUPPORTED_LANGUAGES } from "+languages";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider, Clock };

export async function UpdateUserLanguage(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const body = await bg.safeParseBody(c);
  const language = new bg.Preferences.VO.SupportedLanguagesSet(SUPPORTED_LANGUAGES).ensure(body.language);

  const command = bg.Preferences.Commands.SetUserLanguageCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
    payload: { userId: user.id, language },
  } satisfies bg.Preferences.Commands.SetUserLanguageCommandType);

  await CommandBus.emit(command.name, command);

  return new Response();
}
