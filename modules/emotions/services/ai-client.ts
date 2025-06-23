import type { EmotionalAdvicePromptType } from "./emotional-advice-prompt";

export type AiClientResponseType = string;

export abstract class AiClient {
  abstract request(prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType>;
}
