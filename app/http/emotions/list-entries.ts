import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = { Clock: Adapters.Clock, EntrySnapshot: Adapters.Emotions.EntrySnapshot };

export async function ListEntries(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;

  const filter = Emotions.VO.EntryListFilter.parse(c.req.query("filter"));
  const options = Emotions.VO.EntryListFilterOptions;

  const today = tools.Day.fromNow(deps.Clock.nowMs());

  const range: Record<Emotions.VO.EntryListFilterOptions, (today: tools.Day) => tools.DateRange> = {
    [options.today]: (today) => today,
    [options.last_week]: (today) =>
      new tools.DateRange(tools.Timestamp.parse(today.getEnd() - tools.Duration.Days(7).ms), today.getEnd()),
    [options.last_month]: (today) =>
      new tools.DateRange(tools.Timestamp.parse(today.getEnd() - tools.Duration.Days(30).ms), today.getEnd()),
    [options.all_time]: (today) => new tools.DateRange(tools.Timestamp.parse(0), today.getEnd()),
  };

  const entries = await deps.EntrySnapshot.getByDateRangeForUser(userId, range[filter](today));

  return c.json(entries);
}
