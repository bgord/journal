import * as tools from "@bgord/tools";

export enum ShareableLinkSpecification {
  entries = "entries",
}

export enum ShareableLinkDuration {
  one_day = "one_day",
  one_week = "one_week",
  one_month = "one_month",
}

export const Form = {
  specification: {
    field: { name: "specification", defaultValue: ShareableLinkSpecification.entries },
    options: Object.keys(ShareableLinkSpecification),
  },
  duration: {
    field: { name: "duration", defaultValue: ShareableLinkDuration.one_day },
    options: Object.keys(ShareableLinkDuration),
    map: {
      one_day: tools.Duration.Days(1).ms,
      one_week: tools.Duration.Days(7).ms,
      one_month: tools.Duration.Days(30).ms,
    },
  },
  dateRangeStart: { field: { name: "dateRangeStart" } },
  dateRangeEnd: { field: { name: "dateRangeEnd" } },
};
