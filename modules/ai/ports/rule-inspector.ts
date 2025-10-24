import type * as VO from "+ai/value-objects";

export interface RuleInspectorPort {
  inspect(rule: VO.QuotaRule, context: VO.RequestContext): Promise<VO.QuotaRuleInspectionType>;
}
