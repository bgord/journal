import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type AcceptedEvent = Preferences.Events.ProfileAvatarRemovedEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleRemoveProfileAvatarCommand =
  (deps: Dependencies) => async (command: Preferences.Commands.RemoveProfileAvatarCommandType) => {
    const key = Preferences.VO.ProfileAvatarKeyFactory.stable(command.payload.userId);

    await deps.RemoteFileStorage.delete(key);

    const event = bg.event(
      Preferences.Events.ProfileAvatarRemovedEvent,
      `preferences_${command.payload.userId}`,
      { userId: command.payload.userId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
