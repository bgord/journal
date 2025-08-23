import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import type * as Buses from "+app/ports";

type AcceptedEvent = Preferences.Events.UserLanguageSetEventType;

export const handleSetUserLanguageCommand =
  <L extends readonly string[]>(
    EventStore: Buses.EventStoreLike<AcceptedEvent>,
    query: Preferences.Ports.UserLanguageQueryPort,
    supported: Preferences.VO.SupportedLanguagesSet<L>,
  ) =>
  async (command: Preferences.Commands.SetUserLanguageCommandType) => {
    const candidate = supported.ensure(command.payload.language);
    const current = await query.get(command.payload.userId);

    if (Preferences.Invariants.UserLanguageHasChanged.fails({ current, candidate: command.payload.language }))
      return;

    const event = Preferences.Events.UserLanguageSetEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: Preferences.Events.USER_LANGUAGE_SET_EVENT,
      payload: { userId: command.payload.userId, language: candidate },
    } satisfies Preferences.Events.UserLanguageSetEventType);

    await EventStore.save([event]);
  };
