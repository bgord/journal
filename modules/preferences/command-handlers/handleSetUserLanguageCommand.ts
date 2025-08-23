import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";

type AcceptedEvent = bg.Preferences.Events.UserLanguageSetEventType;

export const handleSetUserLanguageCommand =
  <L extends readonly string[]>(
    EventStore: bg.EventStoreLike<AcceptedEvent>,
    query: bg.Preferences.Ports.UserLanguageQueryPort,
    supported: bg.Preferences.VO.SupportedLanguagesSet<L>,
  ) =>
  async (command: Preferences.Commands.SetUserLanguageCommandType) => {
    const candidate = supported.ensure(command.payload.language);
    const current = await query.get(command.payload.userId);

    if (Preferences.Invariants.UserLanguageHasChanged.fails({ current, candidate: command.payload.language }))
      return;

    const event = bg.Preferences.Events.UserLanguageSetEvent.parse({
      ...bg.createEventEnvelope(`preferences_${command.payload.userId}`),
      name: bg.Preferences.Events.USER_LANGUAGE_SET_EVENT,
      payload: { userId: command.payload.userId, language: candidate },
    } satisfies bg.Preferences.Events.UserLanguageSetEventType);

    await EventStore.save([event]);
  };
