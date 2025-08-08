import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const handleScheduleTimeCapsuleEntryCommand = async (
  command: Emotions.Commands.ScheduleTimeCapsuleEntryCommandType,
) => {
  const event = Emotions.Events.TimeCapsuleEntryScheduledEvent.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    createdAt: tools.Timestamp.parse(Date.now()),
    name: Emotions.Events.TIME_CAPSULE_ENTRY_SCHEDULED_EVENT,
    stream: Emotions.Aggregates.Entry.getStream(command.payload.entryId),
    version: 1,
    payload: {
      entryId: command.payload.entryId,
      situation: {
        description: command.payload.situation.description.get(),
        location: command.payload.situation.location.get(),
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
      language: command.payload.language,
      userId: command.payload.userId,
      scheduledAt: command.payload.scheduledAt,
      scheduledFor: command.payload.scheduledFor,
    },
  } satisfies Emotions.Events.TimeCapsuleEntryScheduledEventType);

  await EventStore.save([event]);
};
