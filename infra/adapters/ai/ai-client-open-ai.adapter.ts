import OAI from "openai";
import * as AI from "+ai";
import { Env } from "+infra/env";

/** @public */
export const OpenAI = new OAI({ apiKey: Env.OPEN_AI_API_KEY });

export class AiClientOpenAiAdapter implements AI.AiClientPort {
  async request(prompt: AI.Prompt): Promise<AI.Advice> {
    const response = await OpenAI.responses.create({
      model: "gpt-4o",
      instructions: prompt.read()[0].content,
      input: prompt.read()[1].content,
      max_output_tokens: AI.AiClientPort.maxLength,
    });

    return new AI.Advice(response.output_text);
  }
}
