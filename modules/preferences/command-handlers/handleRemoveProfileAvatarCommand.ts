import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type AcceptedEvent = Preferences.Events.ProfileAvatarRemovedEventType;

export const handleRemoveProfileAvatarCommand =
  (EventStore: bg.EventStoreLike<AcceptedEvent>, RemoteFileStorage: bg.RemoteFileStoragePort) =>
  async (command: Preferences.Commands.RemoveProfileAvatarCommandType) => {
    const key = Preferences.VO.ProfileAvatarKeyFactory.stable(command.payload.userId);

    await RemoteFileStorage.delete(key);

    const event = Preferences.Events.ProfileAvatarRemovedEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: Preferences.Events.PROFILE_AVATAR_REMOVED_EVENT,
      payload: { userId: command.payload.userId },
    } satisfies Preferences.Events.ProfileAvatarRemovedEventType);

    await EventStore.save([event]);
  };
