import * as bg from "@bgord/bun";

export async function createCsvStringifier(): Promise<bg.CsvStringifierPort> {
  return bg.CsvStringifierAdapter.build();
}
