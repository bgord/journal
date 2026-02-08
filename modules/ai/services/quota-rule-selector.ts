import type * as VO from "+ai/value-objects";

type ApplicableQuota = Readonly<{
  id: VO.QuotaRuleId;
  window: VO.QuotaWindow;
  bucket: VO.QuotaBucketType;
  limit: VO.QuotaLimitType;
}>;

export class QuotaRuleSelector {
  constructor(private readonly rules: ReadonlyArray<VO.QuotaRule>) {}

  select<C extends VO.UsageCategory>(context: VO.RequestContext<C>): ReadonlyArray<ApplicableQuota> {
    return this.rules
      .filter((rule) => rule.appliesTo(context.category))
      .map((rule) => ({ id: rule.id, window: rule.window, bucket: rule.bucket(context), limit: rule.limit }));
  }
}
