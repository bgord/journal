import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Preferences from "+preferences";

type AcceptedEvent = Preferences.Events.ProfileAvatarUpdatedEventType;

export const handleUpdateProfileAvatarCommand =
  (
    _EventStore: bg.EventStoreLike<AcceptedEvent>,
    ImageInfo: bg.ImageInfoPort,
    _ImageFormatter: bg.ImageFormatterPort,
  ) =>
  async (command: Preferences.Commands.UpdateProfileAvatarCommandType) => {
    const path = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    const info = await ImageInfo.inspect(path);
    console.log(info);

    // run invariants here

    // const event = Preferences.Events.ProfileAvatarUpdatedEvent.parse({
    //   ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
    //   name: Preferences.Events.PROFILE_AVATAR_UPDATED_EVENT,
    //   payload: {
    //     userId: command.payload.userId,
    //     extension: ".webp",
    //     height: info.height,
    //     width: info.width,
    //     sizeBytes: info.size.toBytes(),
    //   },
    // } satisfies Preferences.Events.ProfileAvatarUpdatedEventType);

    // await EventStore.save([event]);
  };
