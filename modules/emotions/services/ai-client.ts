import type { EmotionalAdvicePromptType } from "./emotional-advice-prompt";

type AiClientResponseType = string;

export abstract class AiClient {
  constructor(readonly prompt: EmotionalAdvicePromptType) {}

  abstract request(): Promise<AiClientResponseType>;
}
