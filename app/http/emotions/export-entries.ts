import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { EntrySnapshot } from "+infra/adapters/emotions";

export async function ExportEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const timeZoneOffsetMs = c.get("timeZoneOffset").miliseconds;

  const dateRangeStart = tools.Timestamp.parse(
    new Date(c.req.query("dateRangeStart") as string).getTime() + timeZoneOffsetMs,
  );
  const dateRangeEnd = tools.Timestamp.parse(
    new Date(c.req.query("dateRangeEnd") as string).getTime() + timeZoneOffsetMs,
  );
  const dateRange = new tools.DateRange(dateRangeStart, dateRangeEnd);

  const entries = await EntrySnapshot.getByDateRangeForUser(user.id, dateRange);

  return new Emotions.Services.EntryExportFileCsv(entries).toResponse();
}
