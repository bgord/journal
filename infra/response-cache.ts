import * as bg from "@bgord/bun";
import Cache from "node-cache";

const cache = new Cache();

export const ResponseCache = new bg.CacheResponse(cache);
