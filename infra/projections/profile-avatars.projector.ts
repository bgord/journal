import type * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class ProfileAvatarsProjector {
  constructor(eventBus: typeof EventBus, EventHandler: bg.EventHandler) {
    eventBus.on(
      Preferences.Events.PROFILE_AVATAR_UPDATED_EVENT,
      EventHandler.handle(this.onProfileAvatarUpdatedEvent.bind(this)),
    );
  }

  async onProfileAvatarUpdatedEvent(event: Preferences.Events.ProfileAvatarUpdatedEventType) {
    await db.insert(Schema.userProfileAvatars).values({ ...event.payload, createdAt: event.createdAt });
  }
}
