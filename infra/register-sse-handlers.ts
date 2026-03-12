import * as Emotions from "+emotions";
import type { BootstrapType } from "+infra/bootstrap";

export function registerSseHandlers({ Tools }: BootstrapType) {
  Tools.EventBus.on(Emotions.Events.ALARM_GENERATED_EVENT, async (event) => {
    const identity = await Tools.HashContent.hash(event.payload.userId);

    await Tools.SseRegistry.emit(identity.get(), event);
  });
}
