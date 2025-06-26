import * as tools from "@bgord/tools";
import type * as Alarms from "./alarms";

type AlarmGeneratorConfigType = {
  event: Alarms.AlarmEventToBeChecked;
  alarms: tools.Constructor<Alarms.Alarm>[];
};

/** @public */
export class AlarmDetector {
  static detect(config: AlarmGeneratorConfigType): Alarms.AlarmApplicableCheckOutputType | null {
    const result = config.alarms
      .map((Alarm) => new Alarm().check(config.event))
      .filter((result) => result.applicable);

    if (!result.length) return null;

    if (!result[0]) return null;

    return result[0];
  }
}
