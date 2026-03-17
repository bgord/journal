import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as wip from "+infra/build";

type AcceptedEvent = Emotions.Events.TimeCapsuleEntryScheduledEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export const handleScheduleTimeCapsuleEntryCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.ScheduleTimeCapsuleEntryCommandType) => {
    Emotions.Invariants.TimeCapsuleEntryScheduledInFuture.enforce({
      now: deps.Clock.now(),
      scheduledFor: command.payload.scheduledFor,
    });

    const event = wip.event(
      Emotions.Events.TimeCapsuleEntryScheduledEvent,
      Emotions.Aggregates.Entry.getStream(command.payload.entryId),
      {
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
      deps,
    );

    await deps.EventStore.save([event]);
  };
