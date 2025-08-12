import * as VO from "+ai/value-objects";
import type { QuotaViolation } from "../specifications/ai-quota-specification";

export interface AiGatewayPort {
  check<C extends VO.UsageCategory>(context: VO.RequestContext<C>): Promise<{ violations: QuotaViolation[] }>;

  query<C extends VO.UsageCategory>(prompt: VO.Prompt, context: VO.RequestContext<C>): Promise<VO.Advice>;
}
