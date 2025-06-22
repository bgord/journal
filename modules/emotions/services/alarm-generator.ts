import type { EmotionLoggedEventType, ReactionLoggedEventType } from "../events";

type AlarmGeneratorConfigType = {
  events: (EmotionLoggedEventType | ReactionLoggedEventType)[];
};

/** @public */
export class AlarmGenerator {
  static detect(_config: AlarmGeneratorConfigType) {}
}
