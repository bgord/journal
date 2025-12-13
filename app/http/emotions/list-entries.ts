import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import type { EntrySnapshotFormatted } from "+emotions/ports";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
};

export const ListEntries = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;

  const filter = Emotions.VO.EntryListFilter.parse(c.req.query("filter"));
  const query = c.req.query("query") ?? "";
  const options = Emotions.VO.EntryListFilterOptions;

  const today = tools.Day.fromNow(deps.Clock.now());

  const range: Record<Emotions.VO.EntryListFilterOptions, (today: tools.Day) => tools.DateRange> = {
    [options.today]: (today) => today,
    [options.last_week]: (today) =>
      new tools.DateRange(today.getEnd().subtract(tools.Duration.Weeks(1)), today.getEnd()),
    [options.last_month]: (today) =>
      new tools.DateRange(today.getEnd().subtract(tools.Duration.Days(30)), today.getEnd()),
    [options.all_time]: (today) => new tools.DateRange(tools.Timestamp.fromNumber(0), today.getEnd()),
  };

  const entries = await deps.EntrySnapshot.getFormatted(userId, range[filter](today), query);

  const result: EntrySnapshotFormatted[] = entries.map((entry) => ({
    ...entry,
    startedAt: tools.DateFormatters.datetime(entry.startedAt),
  }));

  return c.json(result);
};

export type { EntrySnapshotFormatted } from "+emotions/ports";
