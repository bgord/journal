import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Alarm.generate", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const alarm = Emotions.Aggregates.Alarm.generate(
        mocks.alarmId,
        mocks.entryDetection,
        mocks.userId,
        deps,
      );

      expect(alarm.pullEvents()).toEqual([mocks.GenericAlarmGeneratedEvent]);
      expect(alarm.toSnapshot()).toEqual({
        advice: undefined,
        detection: new Emotions.VO.AlarmDetection(
          mocks.GenericAlarmGeneratedEvent.payload.trigger,
          mocks.GenericAlarmGeneratedEvent.payload.alarmName,
        ),
        id: mocks.GenericAlarmGeneratedEvent.id,
        status: Emotions.VO.AlarmStatusEnum.generated,
        userId: mocks.GenericAlarmGeneratedEvent.payload.userId,
      });
    });
  });
});
