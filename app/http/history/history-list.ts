import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";

type Dependencies = { HistoryReader: bg.History.Ports.HistoryReaderPort };

export const HistoryList = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const subject = bg.History.VO.HistorySubject.parse(c.req.param("subject"));

  const list = await deps.HistoryReader.read(subject);

  return c.json(list.map((item) => ({ ...item, createdAt: tools.DateFormatters.datetime(item.createdAt) })));
};

export type HistoryType = Omit<bg.History.VO.HistoryType, "createdAt"> & { createdAt: string };
