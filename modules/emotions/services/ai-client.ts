import type { EmotionalAdvicePromptType } from "+emotions/services";
import { EmotionalAdvice } from "+emotions/value-objects";

export type AiClientResponseType = string;

export abstract class AiClient {
  static maxLength = EmotionalAdvice.MaximumLength;

  abstract request(prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType>;
}
