import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Preferences from "+preferences";
import { ProfileAvatarUpdatedEvent } from "../events/PROFILE_AVATAR_UPDATED_EVENT";
import { ProfileAvatarConstraints } from "../invariants/profile-avatar-constraints";
import { ProfileAvatarKeyFactory } from "../value-objects/profile-avatar-key";
import { ProfileAvatarSide } from "../value-objects/profile-avatar-side";

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

    if (!ProfileAvatarConstraints.passes(info)) {
      await deps.TemporaryFile.cleanup(temporary.getFilename());
      throw new ProfileAvatarConstraints.error();
    }

    const final = await deps.ImageProcessor.process({
      strategy: "in_place",
      input: temporary,
      to: extension,
      maxSide: ProfileAvatarSide,
    });

    const key = ProfileAvatarKeyFactory.stable(command.payload.userId);
    const object = await deps.RemoteFileStorage.putFromPath({ key, path: final });
    await deps.TemporaryFile.cleanup(final.getFilename());

    const event = bg.event(
      ProfileAvatarUpdatedEvent,
      `preferences_${command.payload.userId}`,
      { userId: command.payload.userId, key, etag: object.etag.get() },
      deps,
    );

    await deps.EventStore.save([event]);
  };
