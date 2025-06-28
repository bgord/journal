import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { Mailer } from "../infra";
import { EventBus } from "../infra/event-bus";
import { OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const openAiClient = new OpenAiClient();

describe("WeeklyReviewProcessing", () => {
  test("onWeeklyReviewSkippedEvent", async () => {
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Weekly Review - come back and journal",
      html: `Week you missed ${mocks.weekStartedAt}`,
    });

    jest.restoreAllMocks();
  });
});
