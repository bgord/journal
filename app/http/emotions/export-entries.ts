import * as tools from "@bgord/tools";
import { endOfDay, startOfDay } from "date-fns";
import type hono from "hono";
import { z } from "zod/v4";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import * as Adapters from "+infra/adapters";

enum ExportEntriesStrategy {
  text = "text",
  csv = "csv",
  markdown = "markdown",
  pdf = "pdf",
}

const deps = {
  Clock: Adapters.Clock,
  Stringifier: Adapters.CsvStringifier,
  PdfGenerator: Adapters.Emotions.PdfGenerator,
};

const StrategySchema = z.enum(ExportEntriesStrategy).default(ExportEntriesStrategy.csv);

export async function ExportEntries(c: hono.Context<infra.HonoConfig>) {
  const userId = c.get("user").id;
  const timeZoneOffsetMs = c.get("timeZoneOffset").ms;

  const dateRangeStart = tools.Timestamp.parse(
    startOfDay(new Date(c.req.query("dateRangeStart") as string).getTime() + timeZoneOffsetMs).getTime(),
  );
  const dateRangeEnd = tools.Timestamp.parse(
    endOfDay(new Date(c.req.query("dateRangeEnd") as string).getTime() + timeZoneOffsetMs).getTime(),
  );
  const dateRange = new tools.DateRange(dateRangeStart, dateRangeEnd);

  const strategy = StrategySchema.parse(c.req.query("strategy"));

  const entries = await Adapters.Emotions.EntrySnapshot.getByDateRangeForUser(userId, dateRange);

  const file = {
    csv: new Emotions.Services.EntryExportFileCsv(entries, deps),
    text: new Emotions.Services.EntryExportFileText(entries, deps),
    markdown: new Emotions.Services.EntryExportFileMarkdown(entries, deps),
    pdf: new Emotions.Services.EntryExportFilePdf(entries, deps),
  };

  return file[strategy].toResponse();
}
