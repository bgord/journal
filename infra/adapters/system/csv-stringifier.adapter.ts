import * as bg from "@bgord/bun";

export function createCsvStringifier(): bg.CsvStringifierPort {
  return new bg.CsvStringifierAdapter();
}
