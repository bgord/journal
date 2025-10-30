import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = { HistoryReader: Adapters.History.HistoryReader };

export async function HistoryList(c: hono.Context<infra.HonoConfig>) {
  const subject = bg.History.VO.HistorySubject.parse(c.req.param("subject"));

  const list = await deps.HistoryReader.read(subject);

  return c.json(list.map((item) => ({ ...item, createdAt: tools.DateFormatters.datetime(item.createdAt) })));
}

export type HistoryType = Omit<bg.History.VO.HistoryType, "createdAt"> & { createdAt: string };
