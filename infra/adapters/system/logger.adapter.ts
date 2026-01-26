import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export class LoggerNoopAdapter implements bg.LoggerPort {
  warn: bg.LoggerPort["warn"] = (_log): void => {};
  error: bg.LoggerPort["error"] = (_log): void => {};
  info: bg.LoggerPort["info"] = (_log): void => {};
  http: bg.LoggerPort["http"] = (_log): void => {};
  verbose: bg.LoggerPort["verbose"] = (_log): void => {};
  debug: bg.LoggerPort["debug"] = (_log): void => {};
  silly: bg.LoggerPort["silly"] = (_log): void => {};

  close() {}

  getStats(): bg.LoggerStatsSnapshot {
    return { written: 0, dropped: 0, deliveryFailures: 0, state: bg.LoggerState.open };
  }
}

export function createLogger(Env: EnvironmentType, deps: Dependencies) {
  const redactor = new bg.RedactorCompositeStrategy([
    new bg.RedactorMetadataCompactArrayStrategy({ maxItems: tools.IntegerPositive.parse(3) }),
    new bg.RedactorMaskStrategy(bg.RedactorMaskStrategy.DEFAULT_KEYS),
  ]);
  const diagnostics = new bg.WoodchopperDiagnosticsConsoleError(redactor);

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.Woodchopper(
      {
        app: "journal",
        environment: Env.type,
        level: Env.LOGS_LEVEL,
        redactor,
        dispatcher: new bg.WoodchopperDispatcherAsync(new bg.WoodchopperSinkStdoutHuman()),
        diagnostics,
      },
      deps,
    ),
    [bg.NodeEnvironmentEnum.test]: new LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.Woodchopper(
      {
        app: "journal",
        environment: Env.type,
        level: Env.LOGS_LEVEL,
        redactor,
        dispatcher: new bg.WoodchopperDispatcherAsync(new bg.WoodchopperSinkStdout()),
        diagnostics,
      },
      deps,
    ),
  }[Env.type];
}
