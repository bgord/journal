import * as bg from "@bgord/bun";
import * as infra from "../../../infra/logger";
import * as Events from "../events";

const EventHandler = new bg.EventHandler(infra.logger);

export const onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent =
  EventHandler.handle<Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType>(
    async (event) => {
      console.log("event to be done");
      console.log(event);
    },
  );
