import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import type { LanguagesType } from "+languages";
import { SITUATION_LOGGED_EVENT } from "../events/SITUATION_LOGGED_EVENT";
import { TimeCapsuleEntryNotificationComposer } from "../services/time-capsule-entry-notification-composer";
import { EntryOriginOption } from "../value-objects/entry-origin-option";

type AcceptedEvent = Emotions.Events.SituationLoggedEventType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  Mailer: bg.MailerPort;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<LanguagesType>;
  EMAIL_FROM: tools.EmailType;
};

export class TimeCapsuleEntryNotifier {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      SITUATION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onSituationLoggedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onSituationLoggedEvent(event: Emotions.Events.SituationLoggedEventType) {
    if (event.payload.origin !== EntryOriginOption.time_capsule) return;

    const contact = await this.deps.UserContactOHQ.getPrimary(event.payload.userId);
    if (!contact?.address) return;

    const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);

    const config = { to: contact.address, from: this.deps.EMAIL_FROM };
    const message = new TimeCapsuleEntryNotificationComposer(language).compose();

    await this.deps.Mailer.send(new bg.MailerTemplate(config, message));
  }
}
