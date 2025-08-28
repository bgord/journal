import type * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

export class ProfileAvatarCleaner {
  constructor(
    EventBus: bg.EventBusLike<Preferences.Events.ProfileAvatarRemovedEventType>,
    EventHandler: bg.EventHandler,
    private readonly RemoteFileStorage: bg.RemoteFileStoragePort,
  ) {
    EventBus.on(
      Preferences.Events.PROFILE_AVATAR_REMOVED_EVENT,
      EventHandler.handle(this.onProfileAvatarRemovedEvent.bind(this)),
    );
  }

  async onProfileAvatarRemovedEvent(event: Preferences.Events.ProfileAvatarRemovedEventType) {
    const key = Preferences.VO.ProfileAvatarKeyFactory.stable(event.payload.userId);

    await this.RemoteFileStorage.delete(key);
  }
}
