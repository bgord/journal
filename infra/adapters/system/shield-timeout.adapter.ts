import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export function createShieldTimeout(): bg.ShieldPort {
  return new bg.ShieldTimeoutAdapter({ duration: tools.Duration.Seconds(15) });
}
