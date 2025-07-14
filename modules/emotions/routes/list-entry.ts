import * as Emotions from "+emotions";
import hono from "hono";

export async function ListEntry(c: hono.Context, _next: hono.Next) {
  const entryId = Emotions.VO.EntryId.parse(c.req.param("entryId"));
  const entry = await Emotions.Repos.EntryRepository.getById(entryId);

  if (!entry) return c.json({ message: "entry.error.not.found" }, 404);

  return c.json(entry);
}
