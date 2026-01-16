import * as z from "zod/v4";
import { EntryOriginOption } from "./entry-origin-option";

export const EntryOrigin = z.enum(EntryOriginOption);
