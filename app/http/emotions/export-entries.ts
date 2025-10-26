import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = {
  Clock: Adapters.Clock,
  Stringifier: Adapters.CsvStringifier,
  PdfGenerator: Adapters.Emotions.PdfGenerator,
};

export async function ExportEntries(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;
  const timeZoneOffsetMs = c.get("timeZoneOffset").ms;

  const start = tools.Day.fromIsoId(tools.DayIsoId.parse(c.req.query("dateRangeStart"))).getStart();
  const end = tools.Day.fromIsoId(tools.DayIsoId.parse(c.req.query("dateRangeEnd"))).getEnd();

  const dateRange = new tools.DateRange(
    tools.Timestamp.parse(start + timeZoneOffsetMs),
    tools.Timestamp.parse(end + timeZoneOffsetMs),
  );

  const strategy = Emotions.VO.ExportEntriesStrategySchema.parse(c.req.query("strategy"));

  const entries = await Adapters.Emotions.EntrySnapshot.getByDateRangeForUser(userId, dateRange);

  return {
    csv: new Emotions.Services.EntryExportFileCsv(entries, deps),
    text: new Emotions.Services.EntryExportFileText(entries, deps),
    markdown: new Emotions.Services.EntryExportFileMarkdown(entries, deps),
    pdf: new Emotions.Services.EntryExportFilePdf(entries, deps),
  }[strategy].toResponse();
}
