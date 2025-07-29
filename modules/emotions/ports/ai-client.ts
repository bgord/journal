import * as VO from "+emotions/value-objects";

export enum AiClientEnum {
  anthropic = "anthropic",
  open_ai = "open_ai",
  noop = "noop",
}

export abstract class AiClientPort {
  static maxLength = VO.Advice.MaximumLength;

  abstract request(prompt: VO.Prompt): Promise<VO.Advice>;
}
