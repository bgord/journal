import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";

type Dependencies = {
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  Stringifier: bg.CsvStringifierPort;
  PdfGenerator: bg.PdfGeneratorPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
};

export const ExportEntries = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const userId = c.get("user").id;
  const timeZoneOffset = c.get("timeZoneOffset");

  const start = tools.Day.fromIsoId(tools.DayIsoId.parse(c.req.query("dateRangeStart"))).getStart();
  const end = tools.Day.fromIsoId(tools.DayIsoId.parse(c.req.query("dateRangeEnd"))).getEnd();

  const dateRange = new tools.DateRange(start.add(timeZoneOffset), end.add(timeZoneOffset));

  const strategy = Emotions.VO.EntryExportStrategy.parse(c.req.query("strategy"));

  const entries = await deps.EntrySnapshot.getByDateRangeForUser(userId, dateRange);

  return {
    csv: new Emotions.Services.EntryExportFileCsv(entries, deps),
    text: new Emotions.Services.EntryExportFileText(entries, deps),
    markdown: new Emotions.Services.EntryExportFileMarkdown(entries, deps),
    pdf: new Emotions.Services.EntryExportFilePdf(entries, deps),
  }[strategy].toResponse();
};
