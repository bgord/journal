import { QuotaWindow } from "./quota-window";
import { UsageCategoryType } from "./usage-category";

export type QuotaRule = {
  id: string;
  window: QuotaWindow;
  limit: number;
  bucket: () => string;
  appliesTo: (category: UsageCategoryType) => boolean;
};
