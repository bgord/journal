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
    map: { one_day: 86_400_000, one_week: 604_800_000, one_month: 2_592_000_000 },
  },
  dateRangeStart: { field: { name: "dateRangeStart" } },
  dateRangeEnd: { field: { name: "dateRangeEnd" } },
};
