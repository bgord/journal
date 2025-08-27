import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";

type AcceptedEvent = Preferences.Events.ProfileAvatarUpdatedEventType;

export const handleUpdateProfileAvatarCommand =
  (
    EventStore: bg.EventStoreLike<AcceptedEvent>,
    ImageInfo: bg.ImageInfoPort,
    ImageProcessor: bg.ImageProcessorPort,
    TemporaryFile: bg.TemporaryFilePort,
    RemoteFileStorage: bg.RemoteFileStoragePort,
  ) =>
  async (command: Preferences.Commands.UpdateProfileAvatarCommandType) => {
    const extension = tools.ExtensionSchema.parse("webp");
    const temporary = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    const info = await ImageInfo.inspect(temporary);

    if (Preferences.Invariants.ProfileAvatarConstraints.fails(info)) {
      await TemporaryFile.cleanup(temporary.getFilename());
      throw new Preferences.Invariants.ProfileAvatarConstraints.error();
    }

    const final = await ImageProcessor.process({
      strategy: "in_place",
      input: temporary,
      to: extension,
      maxSide: Preferences.VO.ProfileAvatarSide,
    });

    const key = Preferences.VO.ProfileAvatarKeyFactory.stable(command.payload.userId);
    const object = await RemoteFileStorage.putFromPath({ key, path: final });

    const event = Preferences.Events.ProfileAvatarUpdatedEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: Preferences.Events.PROFILE_AVATAR_UPDATED_EVENT,
      payload: { userId: command.payload.userId, key, etag: object.etag },
    } satisfies Preferences.Events.ProfileAvatarUpdatedEventType);

    await EventStore.save([event]);
  };
