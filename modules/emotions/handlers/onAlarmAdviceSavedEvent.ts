import type * as Events from "../events";
import * as Repos from "../repositories";

export const onAlarmAdviceSavedEvent = async (
  event: Events.AlarmAdviceSavedEventType,
) => {
  await Repos.AlarmRepository.saveAdvice(event);
};
