import { Advice } from "+emotions/value-objects";
import { Prompt } from "./prompt-template";

export type AiClientResponseType = string;

export enum AiClientEnum {
  anthropic = "anthropic",
  open_ai = "open_ai",
}

export abstract class AiClient {
  static maxLength = Advice.MaximumLength;

  abstract request(prompt: Prompt): Promise<AiClientResponseType>;
}
