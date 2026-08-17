import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Preferences.Commands.RemoveProfileAvatarCommandType>;
};

export const RemoveProfileAvatar = (deps: Dependencies):bg.EndpointPort => async (context) => {

  const userId = context.identity.authenticatedUserId();

  const command = bg.command(Preferences.Commands.RemoveProfileAvatarCommand, { payload: { userId } }, deps);

  await deps.CommandBus.emit(command);

  return new Response(null, { status: 202 });
};
