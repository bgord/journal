import * as Emotions from "+emotions";
import type { BootstrapType } from "+infra/bootstrap";

export function registerSseHandlers({ Tools }: BootstrapType) {
  Tools.EventBus.on(Emotions.Events.SITUATION_LOGGED_EVENT, async (event) => {
    await Tools.SseRegistry.emit(event.payload.userId, event);
  });
}
