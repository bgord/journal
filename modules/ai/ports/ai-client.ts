import * as AI from "+ai";

export abstract class AiClientPort {
  static maxLength = AI.Advice.MaximumLength;

  abstract request(prompt: AI.Prompt): Promise<AI.Advice>;
}
