import type * as Events from "../events";
import * as Repos from "../repositories";

export const onAlarmCancelledEvent = async (event: Events.AlarmCancelledEventType) => {
  await Repos.AlarmRepository.cancel(event);
};
