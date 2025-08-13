import * as Specs from "+ai/specifications";
import * as VO from "+ai/value-objects";

export interface AiGatewayPort {
  check<C extends VO.UsageCategory>(
    context: VO.RequestContext<C>,
  ): Promise<{ violations: Specs.QuotaViolation[] }>;

  query<C extends VO.UsageCategory>(prompt: VO.Prompt, context: VO.RequestContext<C>): Promise<VO.Advice>;
}
