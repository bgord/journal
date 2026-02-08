import type * as Specs from "+ai/specifications";
import type * as VO from "+ai/value-objects";

export interface AiGatewayPort {
  check<C extends VO.UsageCategory>(
    context: VO.RequestContext<C>,
  ): Promise<{ violations: ReadonlyArray<Specs.QuotaViolation> }>;

  query<C extends VO.UsageCategory>(prompt: VO.Prompt, context: VO.RequestContext<C>): Promise<VO.Advice>;
}
