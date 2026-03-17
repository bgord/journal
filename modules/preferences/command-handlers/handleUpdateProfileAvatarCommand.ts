import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Preferences from "+preferences";
import * as wip from "+infra/build";

type AcceptedEvent = Preferences.Events.ProfileAvatarUpdatedEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  ImageInfo: bg.ImageInfoPort;
  ImageProcessor: bg.ImageProcessorPort;
  TemporaryFile: bg.TemporaryFilePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export const handleUpdateProfileAvatarCommand =
  (deps: Dependencies) => async (command: Preferences.Commands.UpdateProfileAvatarCommandType) => {
    const extension = v.parse(tools.Extension, "webp");
    const temporary = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    const info = await deps.ImageInfo.inspect(temporary);

    if (!Preferences.Invariants.ProfileAvatarConstraints.passes(info)) {
      await deps.TemporaryFile.cleanup(temporary.getFilename());
      throw new Preferences.Invariants.ProfileAvatarConstraints.error();
    }

    const final = await deps.ImageProcessor.process({
      strategy: "in_place",
      input: temporary,
      to: extension,
      maxSide: Preferences.VO.ProfileAvatarSide,
    });

    const key = Preferences.VO.ProfileAvatarKeyFactory.stable(command.payload.userId);
    const object = await deps.RemoteFileStorage.putFromPath({ key, path: final });

    const event = wip.event(
      Preferences.Events.ProfileAvatarUpdatedEvent,
      `preferences_${command.payload.userId}`,
      { userId: command.payload.userId, key, etag: object.etag.get() },
      deps,
    );

    await deps.EventStore.save([event]);
  };
