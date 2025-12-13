import type * as bg from "@bgord/bun";
import * as AI from "+ai";

type Dependencies = { Logger: bg.LoggerPort };

export class AiClientNoopAdapter implements AI.AiClientPort {
  constructor(private readonly deps: Dependencies) {}

  async request(prompt: AI.Prompt) {
    this.deps.Logger.info({
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
