import * as tools from "@bgord/tools";

const specifications = ["entries"] as const;

/** @public */
export type SpecificationType = (typeof specifications)[number];
/** @public */
export type DurationType = "one_day" | "one_week" | "one_month";

const durations: Record<DurationType, number> = {
  one_day: tools.Duration.Days(1).ms,
  one_week: tools.Duration.Days(7).ms,
  one_month: tools.Duration.Days(30).ms,
};

/** @public */
export class CreateShareableLinkForm {
  static get() {
    return {
      specifications,
      durations,
    };
  }
}
