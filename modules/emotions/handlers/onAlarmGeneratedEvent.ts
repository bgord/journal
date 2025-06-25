import type * as Events from "../events";
import * as Repos from "../repositories";

export const onAlarmGeneratedEvent = async (event: Events.AlarmGeneratedEventType) => {
  await Repos.AlarmRepository.generate(event);
};
