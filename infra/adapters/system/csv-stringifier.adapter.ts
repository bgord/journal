// cspell:ignore stringifier
import { text } from "node:stream/consumers";
import type * as bg from "@bgord/bun";
import * as csv from "csv";

class CsvStringifierAdapter implements bg.CsvStringifierPort {
  async process(
    columns: ReadonlyArray<bg.CsvColumnType>,
    data: ReadonlyArray<bg.CsvRowType>,
  ): Promise<string> {
    return text(csv.stringify([...data], { header: true, columns }));
  }
}

export const CsvStringifier = new CsvStringifierAdapter();
