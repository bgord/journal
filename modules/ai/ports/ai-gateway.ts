import * as VO from "+ai/value-objects";

export interface AiGatewayPort {
  request<C extends VO.UsageCategory>(prompt: VO.Prompt, context: VO.RequestContext<C>): Promise<VO.Advice>;
}
