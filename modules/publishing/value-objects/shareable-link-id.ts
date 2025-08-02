import * as bg from "@bgord/bun";
import { z } from "zod/v4";

export const ShareableLinkId = bg.UUID;
export type ShareableLinkIdType = z.infer<typeof ShareableLinkId>;
