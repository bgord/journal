import type { EmotionalAdvicePromptType } from "+emotions/services";
import { EmotionalAdvice } from "+emotions/value-objects";

export type AiClientResponseType = string;

export enum AiClientEnum {
  anthropic = "anthropic",
  open_ai = "open_ai",
}

export abstract class AiClient {
  static maxLength = EmotionalAdvice.MaximumLength;

  abstract request(prompt: EmotionalAdvicePromptType): Promise<AiClientResponseType>;
}
