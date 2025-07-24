import * as Emotions from "+emotions";
import type * as infra from "+infra";
import hono from "hono";

export async function ExportEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");

  const entries = await Emotions.Repos.EntryRepository.listEntriesForUser(user.id);

  return new Emotions.Services.EntryExportFile(entries).toResponse();
}
