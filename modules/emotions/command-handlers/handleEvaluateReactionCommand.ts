import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleEvaluateReactionCommand = async (
  command: Emotions.Commands.EvaluateReactionCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.Entry.events,
    Emotions.Aggregates.Entry.getStream(command.payload.entryId),
  );

  const entry = Emotions.Aggregates.Entry.build(command.payload.entryId, history);
  command.revision.validate(entry.revision.value);
  await entry.evaluateReaction(command.payload.newReaction);

  await EventStore.save(entry.pullEvents());
};
