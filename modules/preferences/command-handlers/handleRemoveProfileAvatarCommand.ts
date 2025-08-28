import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type AcceptedEvent = Preferences.Events.ProfileAvatarRemovedEventType;

type Dependencies = {
  EventStore: bg.EventStoreLike<AcceptedEvent>;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleRemoveProfileAvatarCommand =
  (deps: Dependencies) => async (command: Preferences.Commands.RemoveProfileAvatarCommandType) => {
    const key = Preferences.VO.ProfileAvatarKeyFactory.stable(command.payload.userId);

    await deps.RemoteFileStorage.delete(key);

    const event = Preferences.Events.ProfileAvatarRemovedEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: Preferences.Events.PROFILE_AVATAR_REMOVED_EVENT,
      payload: { userId: command.payload.userId },
    } satisfies Preferences.Events.ProfileAvatarRemovedEventType);

    await deps.EventStore.save([event]);
  };
