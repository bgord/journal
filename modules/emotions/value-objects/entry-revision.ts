import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const EntryRevision = tools.RevisionValue.default(tools.Revision.initial);
export type EntryRevisionType = z.infer<typeof EntryRevision>;
