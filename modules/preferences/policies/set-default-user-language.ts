import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as Auth from "+auth";

type Dependencies = {
  EventBus: bg.EventBusPort<Auth.Events.AccountCreatedEventType>;
  EventHandler: bg.EventHandlerStrategy;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<bg.Preferences.Commands.SetUserLanguageCommandType>;
};

export class SetDefaultUserLanguage<L extends ReadonlyArray<tools.LanguageType>> {
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
    const command = bg.command(
      bg.Preferences.Commands.SetUserLanguageCommand,
      { payload: { userId: event.payload.userId, language: this.systemDefaultLanguage } },
      this.deps,
    );

    await this.deps.CommandBus.emit(command);
  }
}
