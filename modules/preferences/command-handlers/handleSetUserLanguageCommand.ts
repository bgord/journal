import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import type * as Buses from "+app/ports";

type AcceptedEvent = Preferences.Events.UserLanguageSetEventType;

export const handleSetUserLanguageCommand =
  (EventStore: Buses.EventStoreLike<AcceptedEvent>, query: Preferences.Ports.UserLanguageQueryPort) =>
  async (command: Preferences.Commands.SetUserLanguageCommandType) => {
    const current = await query.get(command.payload.userId);

    if (Preferences.Invariants.UserLanguageHasChanged.fails({ current, next: command.payload.language }))
      return;

    const event = Preferences.Events.UserLanguageSetEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: Preferences.Events.USER_LANGUAGE_SET_EVENT,
      payload: command.payload,
    } satisfies Preferences.Events.UserLanguageSetEventType);

    await EventStore.save([event]);
  };
