import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import { Clock } from "+infra/adapters/clock.adapter";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { CommandBus } from "+infra/command-bus";

const deps = { IdProvider, Clock };

export async function RemoveProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  const user = c.get("user");

  const command = Preferences.Commands.RemoveProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Preferences.Commands.REMOVE_PROFILE_AVATAR_COMMAND,
    payload: { userId: user.id },
  } satisfies Preferences.Commands.RemoveProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response(null, { status: 202 });
}
