import * as bg from "@bgord/bun";
import * as Emotions from "../";
import { EventStore } from "../../../infra/event-store";

export const handleRequestWeeklyReviewCommand = async (
  command: Emotions.Commands.RequestWeeklyReviewCommandType,
) => {
  const weeklyReviewId = bg.NewUUID.generate();
  const weeklyReview = Emotions.Aggregates.WeeklyReview.create(weeklyReviewId);

  await weeklyReview.request(command.payload.weekStartedAt);

  await EventStore.save(weeklyReview.pullEvents());
};
