import OAI from "openai";
import { AiClient, AiClientResponseType } from "../modules/emotions/services/ai-client";
import { EmotionalAdvicePromptType } from "../modules/emotions/services/emotional-advice-prompt";
import { Env } from "./env";

export const OpenAI = new OAI({ apiKey: Env.OPEN_AI_API_KEY });

export class OpenAiClient implements AiClient {
  async request(prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType> {
    const response = await OpenAI.responses.create({
      model: "gpt-4o",
      instructions: prompt[0].content,
      input: prompt[1].content,
      max_output_tokens: AiClient.maxLength,
    });

    return response.output_text;
  }
}
