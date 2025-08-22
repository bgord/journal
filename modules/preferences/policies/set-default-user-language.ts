import * as bg from "@bgord/bun";
import * as Auth from "+auth";
import type { SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import type * as Buses from "+app/ports";

export class SetDefaultUserLanguage {
  constructor(
    EventBus: Buses.EventBusLike<Auth.Events.AccountCreatedEventType>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: Buses.CommandBusLike<any>,
    private readonly systemDefaultLanguage: SupportedLanguages,
  ) {
    EventBus.on(
      Auth.Events.ACCOUNT_CREATED_EVENT,
      EventHandler.handle(this.onAccountCreatedEvent.bind(this)),
    );
  }

  async onAccountCreatedEvent(event: Auth.Events.AccountCreatedEventType) {
    const command = Preferences.Commands.SetUserLanguageCommand.parse({
      ...bg.createCommandEnvelope(),
      name: Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
      payload: { userId: event.payload.userId, language: this.systemDefaultLanguage },
    } satisfies Preferences.Commands.SetUserLanguageCommandType);

    await this.CommandBus.emit(command.name, command);
  }
}
