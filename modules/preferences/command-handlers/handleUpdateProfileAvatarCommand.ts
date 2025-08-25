import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as Preferences from "+preferences";

type AcceptedEvent = Preferences.Events.ProfileAvatarUpdatedEventType;

type ImageInfoType = { height: tools.HeightType; width: tools.WidthType; mime: tools.Mime; size: tools.Size };

// TODO: create it in @bgord/bun, will be reusable
// Export an adapter using sharp
interface ImageInfoPort {
  inspect(temporary: string): Promise<ImageInfoType>;
}

interface AvatarProcessorPort {
  // clear exit
  // clear orientation
  // convert to webp
  // resize to 256px
  // compress
  // all in place
  process(temporary: string): Promise<ImageInfoType>;
}

export const handleUpdateProfileAvatarCommand =
  (
    EventStore: bg.EventStoreLike<AcceptedEvent>,
    ImageInfo: ImageInfoPort,
    AvatarProcessor: AvatarProcessorPort,
  ) =>
  async (command: Preferences.Commands.UpdateProfileAvatarCommandType) => {
    const temporary = `infra/profile-avatars/${command.payload.userId}${command.payload.extension}`;

    const info = await ImageInfo.inspect(temporary);
    console.log(info);

    // run invariants here

    await AvatarProcessor.process(temporary);

    const event = Preferences.Events.ProfileAvatarUpdatedEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: Preferences.Events.PROFILE_AVATAR_UPDATED_EVENT,
      payload: {
        userId: command.payload.userId,
        extension: ".webp",
        height: info.height,
        width: info.width,
        sizeBytes: info.size.toBytes(),
      },
    } satisfies Preferences.Events.ProfileAvatarUpdatedEventType);

    await EventStore.save([event]);
  };
