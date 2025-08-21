import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { EntrySnapshot } from "+infra/adapters/emotions";

export async function ExportEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const body = await bg.safeParseBody(c);
  const timeZoneOffsetMs = c.get("timeZoneOffset").miliseconds;

  const dateRangeStart = tools.Timestamp.parse(Number(body.dateRangeStart) + timeZoneOffsetMs);
  const dateRangeEnd = tools.Timestamp.parse(Number(body.dateRangeEnd) + timeZoneOffsetMs);
  const dateRange = new tools.DateRange(dateRangeStart, dateRangeEnd);

  const entries = await EntrySnapshot.getByDateRangeForUser(user.id, dateRange);

  return new Emotions.Services.EntryExportFile(entries).toResponse();
}
