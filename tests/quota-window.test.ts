import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import { bootstrap } from "+infra/bootstrap";

describe("QuotaWindow", async () => {
  const di = await bootstrap();

  test("DAY", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.DAY).resetsIn(di.Adapters.System.Clock)).toEqual(
      tools.Duration.Days(1).subtract(tools.Duration.MIN),
    );
  });

  test("WEEK", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.WEEK).resetsIn(di.Adapters.System.Clock)).toEqual(
      tools.Duration.Days(5).subtract(tools.Duration.MIN),
    );
  });

  test("ALL_TIME", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.ALL_TIME).resetsIn(di.Adapters.System.Clock)).toEqual(
      tools.Duration.Ms(Number.MAX_SAFE_INTEGER),
    );
  });
});
