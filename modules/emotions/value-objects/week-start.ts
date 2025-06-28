import * as tools from "@bgord/tools";
import { startOfWeek } from "date-fns";

export class WeekStart {
  constructor(private readonly value: tools.TimestampType) {}

  get(): tools.TimestampType {
    return this.value;
  }

  static fromTimestamp(timestamp: number): WeekStart {
    const result = startOfWeek(timestamp, { weekStartsOn: 1 }).getTime();

    return new WeekStart(tools.Timestamp.parse(result));
  }
}
