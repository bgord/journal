import * as Events from "../events";

export const onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent =
  async (
    event: Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType,
  ) => {
    console.log("event to be done");
    console.log(event);
  };
