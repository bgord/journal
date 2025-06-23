import Anthropic from "@anthropic-ai/sdk";
import { AiClient, AiClientResponseType } from "../modules/emotions/services/ai-client";
import { EmotionalAdvicePromptType } from "../modules/emotions/services/emotional-advice-prompt";
import { Env } from "./env";

export class AnthropicAiClient implements AiClient {
  async request(_prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType> {
    new Anthropic({ apiKey: Env.ANTHROPIC_AI_API_KEY });

    return "";
  }
}
