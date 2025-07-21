import * as bg from "@bgord/bun";
import { cache } from "./cache";

export const ResponseCache = new bg.CacheResponse(cache);
