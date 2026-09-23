import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Entry.delete", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path - after situation", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("happy path - after emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(
      mocks.entryId,
      [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("happy path - after reaction", async () => {
    const entry = Emotions.Aggregates.Entry.build(
      mocks.entryId,
      [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent, mocks.GenericReactionLoggedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("EntryHasBeenStarted", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [], deps);

    expect(() => entry.delete(mocks.userId)).toThrow(Emotions.Invariants.EntryHasBeenStarted.error);
    expect(entry.pullEvents()).toEqual([]);
  });
});
