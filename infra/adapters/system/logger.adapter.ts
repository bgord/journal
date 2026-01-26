import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createLogger(Env: EnvironmentType, deps: Dependencies) {
  const app = "journal";

  const redactor = new bg.RedactorComposite([
    new bg.RedactorMetadataCompactArray({ maxItems: tools.IntegerPositive.parse(3) }),
    new bg.RedactorMask(bg.RedactorMask.DEFAULT_KEYS),
  ]);

  const sampling = new bg.WoodchopperSamplingComposite([
    new bg.WoodchopperSamplingPassLevel([bg.LogLevelEnum.error, bg.LogLevelEnum.warn, bg.LogLevelEnum.info]),
    new bg.WoodchopperSamplingPassComponent(["infra", "security"]),
    new bg.WoodchoperSamplingCorrelationId({ everyNth: tools.IntegerPositive.parse(10) }),
    new bg.WoodchopperSamplingEveryNth({ n: tools.IntegerPositive.parse(10) }),
  ]);

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.Woodchopper(
      {
        app,
        environment: Env.type,
        level: Env.LOGS_LEVEL,
        redactor,
        dispatcher: new bg.WoodchopperDispatcherAsync(new bg.WoodchopperSinkStdoutHuman()),
        diagnostics: new bg.WoodchopperDiagnosticsConsoleError(),
      },
      deps,
    ),
    [bg.NodeEnvironmentEnum.test]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: new bg.LoggerNoopAdapter(),
    [bg.NodeEnvironmentEnum.production]: new bg.Woodchopper(
      {
        app,
        environment: Env.type,
        level: Env.LOGS_LEVEL,
        redactor,
        dispatcher: new bg.WoodchopperDispatcherSampling(
          new bg.WoodchopperDispatcherAsync(new bg.WoodchopperSinkStdout()),
          sampling,
        ),
        diagnostics: new bg.WoodchopperDiagnosticsConsoleError(redactor),
      },
      deps,
    ),
  }[Env.type];
}
