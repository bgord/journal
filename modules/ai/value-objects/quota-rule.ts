import { QuotaWindow } from "./quota-window";

export type QuotaRule = {
  id: string;
  window: QuotaWindow;
  limit: number;
  bucket: () => string;
  appliesTo: () => boolean;
};
