import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

export async function RemoveProfileAvatar(c: hono.Context<infra.Config>) {
  const userId = c.get("user").id;

  const command = Preferences.Commands.RemoveProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Preferences.Commands.REMOVE_PROFILE_AVATAR_COMMAND,
    payload: { userId },
  } satisfies Preferences.Commands.RemoveProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response(null, { status: 202 });
}
