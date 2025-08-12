import * as VO from "+ai/value-objects";

export interface AiGatewayPort {
  query<C extends VO.UsageCategory>(prompt: VO.Prompt, context: VO.RequestContext<C>): Promise<VO.Advice>;
}
