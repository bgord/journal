import * as bg from "@bgord/bun";
import * as Auth from "+auth";
import type { SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import type * as Buses from "+app/ports";

export class InitializeLanguageOnAccountCreated {
  constructor(
    EventBus: Buses.EventBusLike<Auth.Events.AccountCreatedEventType>,
    Handler: bg.EventHandler,
    private readonly CommandBus: Buses.CommandBusLike<any>,
    private readonly systemDefault: SupportedLanguages,
  ) {
    EventBus.on(Auth.Events.ACCOUNT_CREATED_EVENT, Handler.handle(this.onAccountCreatedEvent.bind(this)));
  }

  async onAccountCreatedEvent(event: Auth.Events.AccountCreatedEventType) {
    const cmd = Preferences.Commands.SetUserLanguageCommand.parse({
      ...bg.createCommandEnvelope(),
      name: Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
      payload: { userId: event.payload.userId, language: this.systemDefault },
    });
    await this.CommandBus.emit(cmd.name, cmd);
  }
}
