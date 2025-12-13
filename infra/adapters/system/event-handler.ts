import * as bg from "@bgord/bun";

type Dependencies = { Logger: bg.LoggerPort };

export function createEventHandler(deps: Dependencies): bg.EventHandler {
  return new bg.EventHandler(deps);
}
