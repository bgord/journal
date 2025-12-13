import Anthropic from "@anthropic-ai/sdk";
import * as AI from "+ai";
import type { AnthropicAiApiKey } from "+infra/env";

/** @public */
export class AiClientAnthropicAdapter implements AI.AiClientPort {
  readonly Anthropic: Anthropic;

  constructor(ANTHROPIC_AI_API_KEY: AnthropicAiApiKey) {
    this.Anthropic = new Anthropic({ apiKey: ANTHROPIC_AI_API_KEY });
  }

  async request(prompt: AI.Prompt) {
    const message = await this.Anthropic.messages.create({
      max_tokens: AI.AiClientPort.maxLength,
      messages: [prompt.read()[1]],
      system: prompt.read()[0].content,
      model: "claude-3-5-sonnet-latest",
    });

    return new AI.Advice(message.content.toString());
  }
}
