import Anthropic from "@anthropic-ai/sdk";
import * as AI from "+ai";
import { Env } from "+infra/env";

/** @public */
export const AnthropicAi = new Anthropic({ apiKey: Env.ANTHROPIC_AI_API_KEY });

/** @public */
export class AnthropicAiAdapter implements AI.AiClientPort {
  async request(prompt: AI.Prompt): Promise<AI.Advice> {
    const message = await AnthropicAi.messages.create({
      max_tokens: AI.AiClientPort.maxLength,
      messages: [prompt.read()[1]],
      system: prompt.read()[0].content,
      model: "claude-3-5-sonnet-latest",
    });

    return new AI.Advice(message.content.toString());
  }
}
