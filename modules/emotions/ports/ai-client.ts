import * as VO from "+emotions/value-objects";

export abstract class AiClientPort {
  static maxLength = VO.Advice.MaximumLength;

  abstract request(prompt: VO.Prompt): Promise<VO.Advice>;
}
