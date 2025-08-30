import * as AI from "+ai";
import { Logger } from "+infra/logger.adapter";

export class AiClientNoopAdapter implements AI.AiClientPort {
  async request(prompt: AI.Prompt) {
    Logger.info({
      message: "[NOOP] AI Client adapter",
      component: "infra",
      operation: "write",
      metadata: prompt.read(),
    });

    return new AI.Advice(
      "This is a mock general advice from AI on how to act in a situation of extreme emotions",
    );
  }
}
