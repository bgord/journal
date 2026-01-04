import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as Auth from "+auth";

type Dependencies = {
  EventBus: bg.EventBusLike<Auth.Events.AccountCreatedEventType>;
  EventHandler: bg.EventHandlerStrategy;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusLike<bg.Preferences.Commands.SetUserLanguageCommandType>;
};

export class SetDefaultUserLanguage<L extends readonly tools.LanguageType[]> {
  // Stryker disable all
  constructor(
    private readonly systemDefaultLanguage: L[number],
    private readonly deps: Dependencies,
  ) {
    this.deps.EventBus.on(
      Auth.Events.ACCOUNT_CREATED_EVENT,
      this.deps.EventHandler.handle(this.onAccountCreatedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onAccountCreatedEvent(event: Auth.Events.AccountCreatedEventType) {
    const command = bg.Preferences.Commands.SetUserLanguageCommand.parse({
      ...bg.createCommandEnvelope({ IdProvider: this.deps.IdProvider, Clock: this.deps.Clock }),
      name: bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
      payload: { userId: event.payload.userId, language: this.systemDefaultLanguage },
    } satisfies bg.Preferences.Commands.SetUserLanguageCommandType);

    await this.deps.CommandBus.emit(command.name, command);
  }
}
