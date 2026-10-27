import * as tools from "@bgord/tools";
import * as v from "valibot";
import { EntryId } from "./entry-id";

export const EntryListCursorError = { Invalid: "entry.list.cursor.invalid" };

export const EntryListCursor = v.object(
  { startedAt: tools.TimestampValue, id: EntryId },
  EntryListCursorError.Invalid,
);
export type EntryListCursorType = v.InferOutput<typeof EntryListCursor>;
