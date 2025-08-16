import * as AI from "+ai";
import { AiClientAdapter, Env } from "+infra/env";
import { logger } from "+infra/logger";
import { AnthropicAiAdapter } from "./anthropic-ai.adapter";
import { OpenAiAdapter } from "./open-ai.adapter";

class NoopAdapter implements AI.AiClientPort {
  async request(prompt: AI.Prompt): Promise<AI.Advice> {
    logger.info({ message: "[NOOP] AI Client adapter", operation: "write", metadata: prompt.read() });

    return new AI.Advice(
      "This is a mock general advice from AI on how to act in a situation of extreme emotions",
    );
  }
}

export const AiClient = {
  [AiClientAdapter.anthropic]: new AnthropicAiAdapter(),
  [AiClientAdapter.open_ai]: new OpenAiAdapter(),
  [AiClientAdapter.noop]: new NoopAdapter(),
}[Env.AI_CLIENT_ADAPTER];
