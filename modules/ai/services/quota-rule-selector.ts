import type { QuotaLimitType } from "../value-objects/quota-limit";
import { QuotaRule } from "../value-objects/quota-rule";
import { QuotaWindow } from "../value-objects/quota-window";
import type { RequestContext } from "../value-objects/request-context";
import { UsageCategory } from "../value-objects/usage-category";

export type ApplicableQuota = Readonly<{
  id: string;
  window: QuotaWindow;
  bucket: string;
  limit: QuotaLimitType;
}>;

export class QuotaRuleSelector {
  constructor(private readonly rules: QuotaRule[]) {}

  select<C extends UsageCategory>(ctx: RequestContext<C>): ApplicableQuota[] {
    return this.rules
      .filter((rule) => rule.appliesTo(ctx.category))
      .map((rule) => ({ id: rule.id, window: rule.window, bucket: rule.bucket(ctx), limit: rule.limit }));
  }
}
