import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import { DateFormatter } from "../../../df";

type Dependencies = { HistoryReader: bg.History.Ports.HistoryReaderPort };

export const HistoryList = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const subject = v.parse(bg.History.VO.HistorySubject, c.req.param("subject"));

  const list = await deps.HistoryReader.read(subject);

  return c.json(
    list.map((item) => ({
      ...item,
      createdAt: DateFormatter.datetime(tools.Timestamp.fromValue(item.createdAt)),
    })),
  );
};

export type HistoryType = Omit<bg.History.VO.HistoryType, "createdAt"> & { createdAt: string };
