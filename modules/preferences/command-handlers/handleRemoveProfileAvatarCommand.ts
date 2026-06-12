import * as bg from "@bgord/bun";
import type * as Preferences from "+preferences";
import { ProfileAvatarRemovedEvent } from "../events/PROFILE_AVATAR_REMOVED_EVENT";
import { ProfileAvatarKeyFactory } from "../value-objects/profile-avatar-key";

type AcceptedEvent = Preferences.Events.ProfileAvatarRemovedEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleRemoveProfileAvatarCommand =
  (deps: Dependencies) => async (command: Preferences.Commands.RemoveProfileAvatarCommandType) => {
    const key = ProfileAvatarKeyFactory.stable(command.payload.userId);

    await deps.RemoteFileStorage.delete(key);

    const event = bg.event(
      ProfileAvatarRemovedEvent,
      `preferences_${command.payload.userId}`,
      { userId: command.payload.userId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
