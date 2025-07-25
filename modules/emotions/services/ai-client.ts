import * as VO from "+emotions/value-objects";

export enum AiClientEnum {
  anthropic = "anthropic",
  open_ai = "open_ai",
}

export abstract class AiClient {
  static maxLength = VO.Advice.MaximumLength;

  abstract request(prompt: VO.Prompt): Promise<VO.Advice>;
}
