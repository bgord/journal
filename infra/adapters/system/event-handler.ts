import * as bg from "@bgord/bun";

type Dependencies = { Logger: bg.LoggerPort; Clock: bg.ClockPort };

export function createEventHandler(deps: Dependencies): bg.EventHandlerPort {
  return new bg.EventHandlerWithLoggerAdapter(deps);
}
