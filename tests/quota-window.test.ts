import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Adapters from "+infra/adapters";

describe("QuotaWindow", () => {
  test("DAY", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.DAY).resetsIn(Adapters.Clock)).toEqual(
      tools.Duration.Ms(86399999),
    );
  });

  test("WEEK", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.WEEK).resetsIn(Adapters.Clock)).toEqual(
      tools.Duration.Ms(431999999),
    );
  });

  test("ALL_TIME", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.ALL_TIME).resetsIn(Adapters.Clock)).toEqual(
      tools.Duration.Ms(Number.MAX_SAFE_INTEGER),
    );
  });
});
