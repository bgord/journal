import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const ShieldTimeout = new bg.ShieldTimeoutStrategy({ duration: tools.Duration.Seconds(15) });
