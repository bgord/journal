import * as Emotions from "+emotions";
import hono from "hono";

export async function ListEntries(c: hono.Context, _next: hono.Next) {
  const entries = await Emotions.Repos.EntryRepository.list();
  return c.json(entries);
}
