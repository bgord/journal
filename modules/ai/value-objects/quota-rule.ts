import { QuotaWindow } from "./quota-window";
import { RequestContext } from "./request-context";
import { UsageCategoryType } from "./usage-category";

export type QuotaRule = {
  id: string;
  window: QuotaWindow;
  limit: number;
  bucket: (context: RequestContext) => string;
  appliesTo: (category: UsageCategoryType) => boolean;
};
