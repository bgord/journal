import { EmotionalAdvicePromptType } from "+emotions/services";
import { AiClient, AiClientResponseType } from "+emotions/services/ai-client";
import { Env } from "+infra/env";
import Anthropic from "@anthropic-ai/sdk";

/** @public */
export const AnthropicAi = new Anthropic({ apiKey: Env.ANTHROPIC_AI_API_KEY });

/** @public */
export class AnthropicAiClient implements AiClient {
  async request(prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType> {
    const message = await AnthropicAi.messages.create({
      max_tokens: AiClient.maxLength,
      messages: [prompt[1]],
      system: prompt[0].content,
      model: "claude-3-5-sonnet-latest",
    });

    return message.content.toString();
  }
}
