// cspell:ignore Stringifier
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  CsvStringifier: bg.CsvStringifierPort;
  PdfGenerator: bg.PdfGeneratorPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
};

export const ExportEntries = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const query = context.request.query();

  const userId = context.identity.userId() as string;
  const timeZoneOffset = context.middleware.timeZoneOffset();
  const start = tools.Day.fromIsoId(v.parse(tools.DayIsoId, query["dateRangeStart"])).getStart();
  const end = tools.Day.fromIsoId(v.parse(tools.DayIsoId, query["dateRangeEnd"])).getEnd();
  const strategy = v.parse(Emotions.VO.EntryExportStrategy, query["strategy"]);

  const dateRange = new tools.DateRange(start.add(timeZoneOffset), end.add(timeZoneOffset));

  const entries = await deps.EntrySnapshot.getByDateRangeForUser(userId, dateRange);

  return {
    csv: new Emotions.Services.EntryExportFileCsv(entries, deps),
    text: new Emotions.Services.EntryExportFileText(entries, deps),
    markdown: new Emotions.Services.EntryExportFileMarkdown(entries, deps),
    pdf: new Emotions.Services.EntryExportFilePdf(entries, deps),
  }[strategy].toResponse();
};
