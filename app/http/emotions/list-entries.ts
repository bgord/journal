import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import type { EntrySnapshotFormatted } from "+emotions/ports";
import { DateFormatter } from "../../../df";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
};

export const ListEntries = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;

  const filter = v.parse(Emotions.VO.EntryListFilter, c.req.query("filter"));
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

  const result: ReadonlyArray<EntrySnapshotFormatted> = entries.map((entry) => ({
    ...entry,
    startedAt: DateFormatter.datetime(tools.Timestamp.fromNumber(entry.startedAt)),
  }));

  return c.json(result);
};

export type { EntrySnapshotFormatted } from "+emotions/ports";
