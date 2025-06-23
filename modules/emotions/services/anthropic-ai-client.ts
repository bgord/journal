import { AiClient, AiClientResponseType } from "./ai-client";
import { EmotionalAdvicePromptType } from "./emotional-advice-prompt";

export class AnthropicAiClient implements AiClient {
  async request(
    _prompt: EmotionalAdvicePromptType,
  ): Promise<AiClientResponseType> {
    return "";
  }
}
