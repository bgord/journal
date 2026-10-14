import * as bg from "@bgord/bun";

class AlarmExistsError extends Error {}

type AlarmExistsConfigType = { alarm: object | undefined };
type AlarmExistsPassedConfigType = { alarm: object };

class AlarmExistsFactory extends bg.Invariant<AlarmExistsConfigType, AlarmExistsPassedConfigType> {
  passes(config: AlarmExistsConfigType) {
    return config.alarm !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "alarm.exists";
  error = AlarmExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const AlarmExists = new AlarmExistsFactory();
