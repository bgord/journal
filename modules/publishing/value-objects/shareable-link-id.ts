import * as bg from "@bgord/bun";
import type * as v from "valibot";

export const ShareableLinkId = bg.UUID;
export type ShareableLinkIdType = v.InferOutput<typeof ShareableLinkId>;
