import { describe, expect, jest, spyOn, test } from "bun:test";
import { EventStore } from "../infra/event-store";
import { OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import { AlarmProcessing } from "../modules/emotions/sagas/alarm-processing";
import * as mocks from "./mocks";

const negativeEmotionExtremeIntensityEntry =
  Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
    mocks.GenericSituationLoggedEvent,
    mocks.NegativeEmotionExtremeIntensityLoggedEvent,
  ]);

const advice = new Emotions.VO.EmotionalAdvice("You should do something");

const openAiClient = new OpenAiClient();

describe("AlarmProcessing", () => {
  test("onAlarmGeneratedEvent", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(
      jest.fn(),
    );

    spyOn(Emotions.Aggregates.EmotionJournalEntry, "build").mockReturnValue(
      negativeEmotionExtremeIntensityEntry,
    );

    spyOn(
      Emotions.Services.EmotionalAdviceRequester.prototype,
      "ask",
    ).mockResolvedValue(advice);

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
    ]);
    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new AlarmProcessing(openAiClient);
    await saga.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    eventStoreSave.mockRestore();
    jest.restoreAllMocks();
  });

  test("onAlarmAdviceSavedEvent", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(
      jest.fn(),
    );

    const alarm = Emotions.Aggregates.Alarm.build(mocks.alarmId, [
      mocks.GenericAlarmGeneratedEvent,
      mocks.GenericAlarmAdviceSavedEvent,
    ]);

    spyOn(Emotions.Aggregates.Alarm, "build").mockReturnValue(alarm);

    const saga = new AlarmProcessing(openAiClient);
    await saga.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericAlarmNotificationSentEvent,
    ]);

    eventStoreSave.mockRestore();
    jest.restoreAllMocks();
  });
});
