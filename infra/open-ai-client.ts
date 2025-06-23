import OAI from "openai";
import { AiClient, AiClientResponseType } from "../modules/emotions/services/ai-client";
import { EmotionalAdvicePromptType } from "../modules/emotions/services/emotional-advice-prompt";
import { Env } from "./env";

export class OpenAiClient implements AiClient {
  async request(_prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType> {
    new OAI({ apiKey: Env.OPEN_AI_API_KEY });

    return "";
  }
}
