import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.TimeCapsuleEntryScheduledEventType;

type Dependencies = {
  EventStore: bg.EventStoreLike<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export const handleScheduleTimeCapsuleEntryCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.ScheduleTimeCapsuleEntryCommandType) => {
    const now = deps.Clock.nowMs();

    Emotions.Invariants.TimeCapsuleEntryScheduledInFuture.perform({
      now,
      scheduledFor: command.payload.scheduledFor,
    });

    const event = Emotions.Events.TimeCapsuleEntryScheduledEvent.parse({
      ...bg.createEventEnvelope(Emotions.Aggregates.Entry.getStream(command.payload.entryId), deps),
      name: Emotions.Events.TIME_CAPSULE_ENTRY_SCHEDULED_EVENT,
      payload: {
        entryId: command.payload.entryId,
        situation: {
          description: command.payload.situation.description.get(),
          kind: command.payload.situation.kind.get(),
        },
        emotion: {
          label: command.payload.emotion.label.get(),
          intensity: command.payload.emotion.intensity.get(),
        },
        reaction: {
          type: command.payload.reaction.type.get(),
          effectiveness: command.payload.reaction.effectiveness.get(),
          description: command.payload.reaction.description.get(),
        },
        userId: command.payload.userId,
        scheduledAt: command.payload.scheduledAt,
        scheduledFor: command.payload.scheduledFor,
      },
    } satisfies Emotions.Events.TimeCapsuleEntryScheduledEventType);

    await deps.EventStore.save([event]);
  };
