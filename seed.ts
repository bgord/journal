import * as bg from "@bgord/bun";
import { db } from "./infra/db";
import * as schema from "./infra/schema";
import * as Emotions from "./modules/emotions";

const id = bg.NewUUID.generate();

export const GenericSituationLoggedEvent = {
  id: bg.NewUUID.generate(),
  createdAt: Date.now(),
  name: Emotions.Aggregates.SITUATION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(bg.NewUUID.generate()),
  version: 1,
  payload: JSON.stringify({
    id,
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "work",
  }),
};

(async function main() {
  await db.insert(schema.events).values([GenericSituationLoggedEvent]);

  console.log("Seeding complete.");
})();
