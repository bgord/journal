import * as bg from "@bgord/bun";
import type * as Emotions from "+emotions";
import { Entry } from "../aggregates/entry";
import { TimeCapsuleEntryScheduledEvent } from "../events/TIME_CAPSULE_ENTRY_SCHEDULED_EVENT";
import { TimeCapsuleEntryScheduledInFuture } from "../invariants/time-capsule-entry-scheduled-in-future";

type AcceptedEvent = Emotions.Events.TimeCapsuleEntryScheduledEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
};

export const handleScheduleTimeCapsuleEntryCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.ScheduleTimeCapsuleEntryCommandType) => {
    TimeCapsuleEntryScheduledInFuture.enforce({
      now: deps.Clock.now(),
      scheduledFor: command.payload.scheduledFor,
    });

    const event = bg.event(
      TimeCapsuleEntryScheduledEvent,
      Entry.getStream(command.payload.entryId),
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
