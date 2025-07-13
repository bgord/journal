import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleDeleteEntryCommand = async (command: Emotions.Commands.DeleteEntryCommandType) => {
  const history = await EventStore.find(
    Emotions.Aggregates.Entry.events,
    Emotions.Aggregates.Entry.getStream(command.payload.entryId),
  );

  const entry = Emotions.Aggregates.Entry.build(command.payload.entryId, history);
  command.revision.validate(entry.revision.value);
  await entry.delete();

  await EventStore.save(entry.pullEvents());
};
