import { EmotionalAdvice } from "../value-objects/emotional-advice";
import type { EmotionalAdvicePromptType } from "./emotional-advice-prompt";

export type AiClientResponseType = string;

export abstract class AiClient {
  static maxLength = EmotionalAdvice.MaximumLength;

  abstract request(prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType>;
}
