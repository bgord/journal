import type * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Preferences from "+preferences";
import * as wip from "+infra/build";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Preferences.Commands.RemoveProfileAvatarCommandType>;
};

export const RemoveProfileAvatar = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;

  const command = wip.command(Preferences.Commands.RemoveProfileAvatarCommand, { payload: { userId } }, deps);

  await deps.CommandBus.emit(command);

  return new Response(null, { status: 202 });
};
