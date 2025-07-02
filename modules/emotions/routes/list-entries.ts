import hono from "hono";
import * as Emotions from "../";

export async function ListEntries(c: hono.Context, _next: hono.Next) {
  const entries = await Emotions.Repos.EmotionJournalEntryRepository.list();
  return c.json(entries);
}
