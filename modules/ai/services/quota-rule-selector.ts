import type * as VO from "+ai/value-objects";

type ApplicableQuota = Readonly<{
  id: VO.QuotaRuleId;
  window: VO.QuotaWindow;
  bucket: VO.QuotaBucketType;
  limit: VO.QuotaLimitType;
}>;

export class QuotaRuleSelector {
  constructor(private readonly rules: VO.QuotaRule[]) {}

  select<C extends VO.UsageCategory>(ctx: VO.RequestContext<C>): ApplicableQuota[] {
    return this.rules
      .filter((rule) => rule.appliesTo(ctx.category))
      .map((rule) => ({ id: rule.id, window: rule.window, bucket: rule.bucket(ctx), limit: rule.limit }));
  }
}
