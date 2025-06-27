import { EventStore } from "../../../infra";
import * as Emotions from "../";

export const handleLogSituationCommand = async (command: Emotions.Commands.LogSituationCommandType) => {
  const entry = Emotions.Aggregates.EmotionJournalEntry.create(command.payload.id);
  await entry.logSituation(command.payload.situation);

  await EventStore.save(entry.pullEvents());
};
