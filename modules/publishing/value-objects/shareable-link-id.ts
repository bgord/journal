import * as bg from "@bgord/bun";
import type { z } from "zod/v4";

export const ShareableLinkId = bg.UUID;
export type ShareableLinkIdType = z.infer<typeof ShareableLinkId>;
