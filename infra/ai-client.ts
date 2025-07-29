import * as Ports from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { AnthropicAiAdapter } from "+infra/anthropic-ai-adapter";
import { AiClientEnum, Env } from "+infra/env";
import { logger } from "+infra/logger";
import { OpenAiAdapter } from "+infra/open-ai-adapter";

export class NoopAdapter implements Ports.AiClientPort {
  async request(prompt: VO.Prompt): Promise<VO.Advice> {
    logger.info({ message: "[NOOP] AI Client adapter", operation: "write", metadata: prompt.read() });

    return new VO.Advice(
      "This is a mock general advice from Open AI on how to act in a situation of extreme emotions",
    );
  }
}

export const AiClient = {
  [AiClientEnum.anthropic]: new AnthropicAiAdapter(),
  [AiClientEnum.open_ai]: new OpenAiAdapter(),
  [AiClientEnum.noop]: new NoopAdapter(),
}[Env.AI_CLIENT_ADAPTER];
