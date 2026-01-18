import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import type { SUPPORTED_LANGUAGES } from "+languages";

type AcceptedEvent = Emotions.Events.SituationLoggedEventType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  Mailer: bg.MailerPort;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<typeof SUPPORTED_LANGUAGES>;
  EMAIL_FROM: tools.EmailType;
};

export class TimeCapsuleEntryNotifier {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      Emotions.Events.SITUATION_LOGGED_EVENT,
      deps.EventHandler.handle(this.onSituationLoggedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onSituationLoggedEvent(event: Emotions.Events.SituationLoggedEventType) {
    if (event.payload.origin !== Emotions.VO.EntryOriginOption.time_capsule) return;

    const contact = await this.deps.UserContactOHQ.getPrimary(event.payload.userId);
    if (!contact?.address) return;

    const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);

    const config = { to: contact.address, from: this.deps.EMAIL_FROM };
    const message = new Emotions.Services.TimeCapsuleEntryNotificationComposer(language).compose();

    await this.deps.Mailer.send(new bg.MailerTemplate(config, message));
  }
}
