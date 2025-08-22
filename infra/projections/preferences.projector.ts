import type * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import type { EventBus } from "+infra/event-bus";

export class PreferencesProjector {
  constructor(eventBus: typeof EventBus, EventHandler: bg.EventHandler) {
    eventBus.on(
      Preferences.Events.USER_LANGUAGE_SET_EVENT,
      EventHandler.handle(this.onUserLanguageSetEvent.bind(this)),
    );
  }

  async onUserLanguageSetEvent(_event: Preferences.Events.UserLanguageSetEventType) {}
}
