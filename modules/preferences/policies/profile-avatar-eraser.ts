import type * as bg from "@bgord/bun";
import * as Auth from "+auth";
import { ProfileAvatarKeyFactory } from "../value-objects/profile-avatar-key";

type AcceptedEvent = Auth.Events.AccountDeletedEventType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export class ProfileAvatarEraser {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await this.deps.RemoteFileStorage.delete(ProfileAvatarKeyFactory.stable(event.payload.userId));
  }
}
