import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";

type AcceptedEvent = Preferences.Events.ProfileAvatarUpdatedEventType;

export const handleUpdateProfileAvatarCommand =
  (
    EventStore: bg.EventStoreLike<AcceptedEvent>,
    ImageInfo: bg.ImageInfoPort,
    ImageProcessor: bg.ImageProcessorPort,
  ) =>
  async (command: Preferences.Commands.UpdateProfileAvatarCommandType) => {
    const extension = tools.ExtensionSchema.parse("webp");
    const temporary = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    const info = await ImageInfo.inspect(temporary);
    console.log(info);

    // run invariants here

    await ImageProcessor.process({
      strategy: "in_place",
      input: temporary,
      to: extension,
      maxSide: Preferences.VO.ProfileAvatarMaxSide,
    });

    const event = Preferences.Events.ProfileAvatarUpdatedEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: Preferences.Events.PROFILE_AVATAR_UPDATED_EVENT,
      payload: {
        userId: command.payload.userId,
        extension,
        height: info.height,
        width: info.width,
        sizeBytes: info.size.toBytes(),
      },
    } satisfies Preferences.Events.ProfileAvatarUpdatedEventType);

    await EventStore.save([event]);
  };
