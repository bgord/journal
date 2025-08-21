import * as tools from "@bgord/tools";
import type hono from "hono";
import { z } from "zod/v4";
import * as Emotions from "+emotions";
import type * as infra from "+infra";
import { EntrySnapshot, PdfGenerator } from "+infra/adapters/emotions";

enum ExportEntriesStrategy {
  text = "text",
  csv = "csv",
  markdown = "markdown",
  pdf = "pdf",
}

const StrategySchema = z.enum(ExportEntriesStrategy).default(ExportEntriesStrategy.csv);

export async function ExportEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const timeZoneOffsetMs = c.get("timeZoneOffset").miliseconds;

  const dateRangeStart = tools.Timestamp.parse(
    new Date(c.req.query("dateRangeStart") as string).getTime() + timeZoneOffsetMs,
  );
  const dateRangeEnd = tools.Timestamp.parse(
    new Date(c.req.query("dateRangeEnd") as string).getTime() + timeZoneOffsetMs,
  );
  const dateRange = new tools.DateRange(dateRangeStart, dateRangeEnd);

  const strategy = StrategySchema.parse(c.req.query("strategy"));

  const entries = await EntrySnapshot.getByDateRangeForUser(user.id, dateRange);

  const file = {
    csv: new Emotions.Services.EntryExportFileCsv(entries),
    text: new Emotions.Services.EntryExportFileText(entries),
    markdown: new Emotions.Services.EntryExportFileMarkdown(entries),
    pdf: new Emotions.Services.EntryExportFilePdf(PdfGenerator, entries),
  };

  return file[strategy].toResponse();
}
