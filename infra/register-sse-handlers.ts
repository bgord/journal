import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import type { BootstrapType } from "+infra/bootstrap";

export function registerSseHandlers({ Tools }: BootstrapType) {
  const HashContent = new bg.HashContentSha256Strategy();

  Tools.EventBus.on(Emotions.Events.ALARM_GENERATED_EVENT, async (event) => {
    const identity = await HashContent.hash(event.payload.userId);

    await Tools.SseRegistry.emit(identity.get(), event);
  });
}
