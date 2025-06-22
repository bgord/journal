import * as tools from "@bgord/tools";
import type * as Alarms from "./alarms";

type AlarmGeneratorConfigType = {
  event: Alarms.AlarmEventToBeChecked;
  alarms: tools.Constructor<Alarms.Alarm>[];
};

/** @public */
export class AlarmGenerator {
  static detect(config: AlarmGeneratorConfigType): Alarms.AlarmCheckOutputType {
    const result = config.alarms
      .map((Alarm) => new Alarm().check(config.event))
      .filter((result) => result !== null);

    if (!result.length) return null;

    return result[0] ?? null;
  }
}
