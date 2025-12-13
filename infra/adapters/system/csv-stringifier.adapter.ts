import * as bg from "@bgord/bun";

export function createCsvStringifier() {
  return new bg.CsvStringifierAdapter();
}
