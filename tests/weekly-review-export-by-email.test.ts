import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewExportByEmail", () => {
  test("onWeeklyReviewExportByEmailRequestedEvent - no email", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(undefined);

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailRequestedEvent(
          mocks.GenericWeeklyReviewExportByEmailRequestedEvent,
        ),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
