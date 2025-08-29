import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import { IdProvider } from "+infra/adapters/id-provider.adapter";
import { CommandBus } from "+infra/command-bus";

export async function RemoveProfileAvatar(c: hono.Context<infra.HonoConfig>) {
  const user = c.get("user");

  const command = Preferences.Commands.RemoveProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(IdProvider),
    name: Preferences.Commands.REMOVE_PROFILE_AVATAR_COMMAND,
    payload: { userId: user.id },
  } satisfies Preferences.Commands.RemoveProfileAvatarCommandType);

  await CommandBus.emit(command.name, command);

  return new Response(null, { status: 202 });
}
