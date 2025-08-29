import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as Auth from "+auth";

export class SetDefaultUserLanguage<L extends readonly tools.LanguageType[]> {
  constructor(
    EventBus: bg.EventBusLike<Auth.Events.AccountCreatedEventType>,
    EventHandler: bg.EventHandler,
    private readonly IdProvider: bg.IdProviderPort,
    private readonly CommandBus: bg.CommandBusLike<any>,
    private readonly systemDefaultLanguage: L[number],
  ) {
    EventBus.on(
      Auth.Events.ACCOUNT_CREATED_EVENT,
      EventHandler.handle(this.onAccountCreatedEvent.bind(this)),
    );
  }

  async onAccountCreatedEvent(event: Auth.Events.AccountCreatedEventType) {
    const command = bg.Preferences.Commands.SetUserLanguageCommand.parse({
      ...bg.createCommandEnvelope(this.IdProvider),
      name: bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
      payload: { userId: event.payload.userId, language: this.systemDefaultLanguage },
    } satisfies bg.Preferences.Commands.SetUserLanguageCommandType);

    await this.CommandBus.emit(command.name, command);
  }
}
