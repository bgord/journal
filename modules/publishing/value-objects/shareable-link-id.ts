import * as bg from "@bgord/bun";
import * as v from "valibot";

export const ShareableLinkId = v.pipe(bg.UUID, v.brand("ShareableLinkId"));
export type ShareableLinkIdType = v.InferOutput<typeof ShareableLinkId>;
