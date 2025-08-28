import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
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
    eventBus.on(
      Preferences.Events.PROFILE_AVATAR_REMOVED_EVENT,
      EventHandler.handle(this.onProfileAvatarRemovedEvent).bind(this),
    );
  }

  async onProfileAvatarUpdatedEvent(event: Preferences.Events.ProfileAvatarUpdatedEventType) {
    await db.insert(Schema.userProfileAvatars).values({ ...event.payload, createdAt: event.createdAt });
  }

  async onProfileAvatarRemovedEvent(event: Preferences.Events.ProfileAvatarRemovedEventType) {
    await db
      .delete(Schema.userProfileAvatars)
      .where(eq(Schema.userProfileAvatars.userId, event.payload.userId));
  }
}
