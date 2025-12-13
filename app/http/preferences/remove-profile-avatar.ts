import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<Preferences.Commands.RemoveProfileAvatarCommandType>;
};

export const RemoveProfileAvatar = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;

  const command = Preferences.Commands.RemoveProfileAvatarCommand.parse({
    ...bg.createCommandEnvelope(deps),
    name: Preferences.Commands.REMOVE_PROFILE_AVATAR_COMMAND,
    payload: { userId },
  } satisfies Preferences.Commands.RemoveProfileAvatarCommandType);

  await deps.CommandBus.emit(command.name, command);

  return new Response(null, { status: 202 });
};
