import type * as VO from "+ai/value-objects";

export type QuotaRule = {
  id: VO.QuotaRuleId;
  window: VO.QuotaWindow;
  limit: VO.QuotaLimitType;
  bucket: (context: VO.RequestContext) => VO.QuotaBucketType;
  appliesTo: (category: VO.UsageCategory) => boolean;
};
