import * as Ports from "+emotions/ports";
import * as VO from "+emotions/value-objects";
import { Env } from "+infra/env";
import Anthropic from "@anthropic-ai/sdk";

/** @public */
export const AnthropicAi = new Anthropic({ apiKey: Env.ANTHROPIC_AI_API_KEY });

/** @public */
export class AnthropicAiAdapter implements Ports.AiClientPort {
  async request(prompt: VO.Prompt): Promise<VO.Advice> {
    const message = await AnthropicAi.messages.create({
      max_tokens: Ports.AiClientPort.maxLength,
      messages: [prompt.read()[1]],
      system: prompt.read()[0].content,
      model: "claude-3-5-sonnet-latest",
    });

    return new VO.Advice(message.content.toString());
  }
}
