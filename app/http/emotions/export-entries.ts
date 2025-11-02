import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

const deps = {
  Clock: Adapters.Clock,
  Stringifier: Adapters.CsvStringifier,
  PdfGenerator: Adapters.Emotions.PdfGenerator,
  EntrySnapshot: Adapters.Emotions.EntrySnapshot,
};

export async function ExportEntries(c: hono.Context<infra.HonoConfig>) {
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
}
