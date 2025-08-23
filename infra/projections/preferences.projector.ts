import * as bg from "@bgord/bun";
import { db } from "+infra/db";
import type { EventBus } from "+infra/event-bus";
import * as Schema from "+infra/schema";

export class PreferencesProjector {
  constructor(eventBus: typeof EventBus, EventHandler: bg.EventHandler) {
    eventBus.on(
      bg.Preferences.Events.USER_LANGUAGE_SET_EVENT,
      EventHandler.handle(this.onUserLanguageSetEvent.bind(this)),
    );
  }

  async onUserLanguageSetEvent(event: bg.Preferences.Events.UserLanguageSetEventType) {
    await db
      .insert(Schema.userPreferences)
      .values({
        userId: event.payload.userId,
        preference: "language",
        value: event.payload.language,
        updatedAt: event.createdAt,
      })
      .onConflictDoUpdate({
        target: [Schema.userPreferences.userId, Schema.userPreferences.preference],
        set: { value: event.payload.language, updatedAt: event.createdAt },
      });
  }
}
