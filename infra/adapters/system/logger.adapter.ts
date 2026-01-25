import * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createLogger(Env: EnvironmentType, deps: Dependencies): bg.LoggerPort {
  const redactor = new bg.RedactorCompositeStrategy([
    new bg.RedactorMetadataCompactArrayStrategy(),
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
    [bg.NodeEnvironmentEnum.test]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.Woodchopper(
      {
        app: "lobbygow",
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
