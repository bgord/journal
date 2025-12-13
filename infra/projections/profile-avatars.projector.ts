import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Preferences from "+preferences";
import type { createEventBus } from "+infra/adapters/system/event-bus";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = { EventBus: ReturnType<typeof createEventBus>; EventHandler: bg.EventHandler };

export class ProfileAvatarsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Preferences.Events.PROFILE_AVATAR_UPDATED_EVENT,
      deps.EventHandler.handle(this.onProfileAvatarUpdatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Preferences.Events.PROFILE_AVATAR_REMOVED_EVENT,
      deps.EventHandler.handle(this.onProfileAvatarRemovedEvent.bind(this)),
    );
  }

  async onProfileAvatarUpdatedEvent(event: Preferences.Events.ProfileAvatarUpdatedEventType) {
    await db
      .insert(Schema.userProfileAvatars)
      .values({ ...event.payload, createdAt: event.createdAt })
      .onConflictDoUpdate({
        target: Schema.userProfileAvatars.userId,
        set: { key: event.payload.key, etag: event.payload.etag, createdAt: event.createdAt },
      });
  }

  async onProfileAvatarRemovedEvent(event: Preferences.Events.ProfileAvatarRemovedEventType) {
    await db
      .delete(Schema.userProfileAvatars)
      .where(eq(Schema.userProfileAvatars.userId, event.payload.userId));
  }
}
