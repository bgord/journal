import { AiClient, AiClientResponseType } from "+emotions/services/ai-client";
import * as VO from "+emotions/value-objects";
import { Env } from "+infra/env";
import Anthropic from "@anthropic-ai/sdk";
import * as tools from "@bgord/tools";

/** @public */
export const AnthropicAi = new Anthropic({ apiKey: Env.ANTHROPIC_AI_API_KEY });

/** @public */
export class AnthropicAiClient implements AiClient {
  async request(prompt: VO.Prompt): Promise<AiClientResponseType> {
    if (tools.FeatureFlag.isEnabled(Env.FF_AI_CLIENT_REAL_RESPONSE)) {
      const message = await AnthropicAi.messages.create({
        max_tokens: AiClient.maxLength,
        messages: [prompt.read()[1]],
        system: prompt.read()[0].content,
        model: "claude-3-5-sonnet-latest",
      });

      return message.content.toString();
    }

    return "This is a mock general advice from Anthropic AI how to act on an extreme emotion";
  }
}
