import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";

type Dependencies = { HistoryReader: bg.History.Ports.HistoryReaderPort };

export const HistoryList = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();

  const subject = v.parse(bg.History.VO.HistorySubject, params["subject"]);

  const list = await deps.HistoryReader.read(subject);

  return Response.json(
    list.map((item) => ({
      ...item,
      createdAt: tools.DateFormatter.datetime(tools.Timestamp.fromValueSafe(item.createdAt)),
    })),
  );
};

export type HistoryType = Omit<bg.History.VO.HistoryType, "createdAt"> & { createdAt: string };
