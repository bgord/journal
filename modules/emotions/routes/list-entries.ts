import * as Emotions from "+emotions";
import type * as infra from "+infra";
import hono from "hono";

export async function ListEntries(c: hono.Context<infra.HonoConfig>, _next: hono.Next) {
  const user = c.get("user");
  const entries = await Emotions.Repos.EntryRepository.listForUser(user.id);
  return c.json(entries);
}
