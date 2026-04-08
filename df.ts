import * as tools from "@bgord/tools";

export class DateFormatter {
  static datetime(timestamp: tools.Timestamp, offset: tools.Duration = tools.Duration.ZERO): string {
    const adjusted = timestamp.add(offset);
    const zdt = adjusted.toInstant().toZonedDateTimeISO("UTC");

    const month = zdt.month.toString().padStart(2, "0");
    const day = zdt.day.toString().padStart(2, "0");
    const hour = zdt.hour.toString().padStart(2, "0");
    const minute = zdt.minute.toString().padStart(2, "0");

    return `${zdt.year}/${month}/${day} ${hour}:${minute}`;
  }

  static date(timestamp: tools.Timestamp, offset: tools.Duration = tools.Duration.ZERO): string {
    const adjusted = timestamp.add(offset);
    const zdt = adjusted.toInstant().toZonedDateTimeISO("UTC");

    const month = zdt.month.toString().padStart(2, "0");
    const day = zdt.day.toString().padStart(2, "0");

    return `${zdt.year}/${month}/${day}`;
  }
}
