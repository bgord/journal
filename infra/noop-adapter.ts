import * as Ports from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { logger } from "+infra/logger";

export class NoopAdapter implements Ports.AiClientPort {
  async request(prompt: VO.Prompt): Promise<VO.Advice> {
    logger.info({ message: "[NOOP AI ADAPTER]", operation: "write", metadata: prompt.read() });

    return new VO.Advice(
      "This is a mock general advice from Open AI on how to act in a situation of extreme emotions",
    );
  }
}
