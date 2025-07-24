import * as Emotions from "+emotions";
import type * as infra from "+infra";
import hono from "hono";

export async function ExportEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");

  const entries = await Emotions.Repos.EntryRepository.listEntriesForUser(user.id);

  const file = new Emotions.Services.EntryExportFile(entries);

  return new Response(file.generate() as any, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="entries.csv"`,
    },
  });
}
