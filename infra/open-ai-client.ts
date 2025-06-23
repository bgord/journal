import OpenAi from "openai";
import { AiClient, AiClientResponseType } from "../modules/emotions/services/ai-client";
import { EmotionalAdvicePromptType } from "../modules/emotions/services/emotional-advice-prompt";
import { Env } from "./env";

const ai = new OpenAi({ apiKey: Env.OPEN_AI_API_KEY });

export class OpenAiClient implements AiClient {
  async request(_prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType> {
    const response = await ai.responses.create({
      model: "gpt-4o",
      instructions: _prompt[0].content,
      input: _prompt[1].content,
      max_output_tokens: 500,
    });

    return response.output_text;
  }
}
