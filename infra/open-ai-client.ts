import { AiClient } from "+emotions/services/ai-client";
import * as VO from "+emotions/value-objects";
import { Env } from "+infra/env";
import * as tools from "@bgord/tools";
import OAI from "openai";

/** @public */
export const OpenAI = new OAI({ apiKey: Env.OPEN_AI_API_KEY });

export class OpenAiClient implements AiClient {
  async request(prompt: VO.Prompt): Promise<VO.Advice> {
    if (tools.FeatureFlag.isEnabled(Env.FF_AI_CLIENT_REAL_RESPONSE)) {
      const response = await OpenAI.responses.create({
        model: "gpt-4o",
        instructions: prompt.read()[0].content,
        input: prompt.read()[1].content,
        max_output_tokens: AiClient.maxLength,
      });

      return new VO.Advice(response.output_text);
    }

    return new VO.Advice("This is a mock general advice from Open AI");
  }
}
