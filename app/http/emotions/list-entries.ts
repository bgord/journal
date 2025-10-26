import * as tools from "@bgord/tools";
import type hono from "hono";
import { z } from "zod/v4";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = { Clock: Adapters.Clock, EntrySnapshot: Adapters.Emotions.EntrySnapshot };

enum EntryFilter {
  today = "today",
  last_week = "last_week",
  last_month = "last_month",
  all_time = "all_time",
}

export const EntryFilterSchema = z.enum(EntryFilter).default(EntryFilter.today);

export async function ListEntries(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;
  const filter = EntryFilterSchema.parse(c.req.query("filter"));

  const today = tools.Day.fromNow(deps.Clock.nowMs());

  const range: Record<EntryFilter, (today: tools.Day) => tools.DateRange> = {
    [EntryFilter.today]: (today) => today,
    [EntryFilter.last_week]: (today) =>
      new tools.DateRange(tools.Timestamp.parse(today.getEnd() - tools.Duration.Days(7).ms), today.getEnd()),
    [EntryFilter.last_month]: (today) =>
      new tools.DateRange(tools.Timestamp.parse(today.getEnd() - tools.Duration.Days(30).ms), today.getEnd()),
    [EntryFilter.all_time]: (today) => new tools.DateRange(tools.Timestamp.parse(0), today.getEnd()),
  };

  const entries = await deps.EntrySnapshot.getByDateRangeForUser(userId, range[filter](today));

  return c.json(entries);
}
