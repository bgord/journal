import * as tools from "@bgord/tools";

const specifications = ["entries"] as const;

export type SpecificationType = (typeof specifications)[number];
export type DurationType = "one_day" | "one_week" | "one_month";

const durations: Record<DurationType, number> = {
  one_day: tools.Time.Days(1).ms,
  one_week: tools.Time.Days(7).ms,
  one_month: tools.Time.Days(30).ms,
};

export class CreateShareableLinkForm {
  static get() {
    return {
      specifications,
      durations,
    };
  }
}
