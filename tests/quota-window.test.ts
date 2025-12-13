import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("QuotaWindow", async () => {
  const di = await bootstrap(mocks.Env);

  test("DAY", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.DAY).resetsIn(di.Adapters.System.Clock)).toEqual(
      // TODO
      tools.Duration.Ms(86399999),
    );
  });

  test("WEEK", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.WEEK).resetsIn(di.Adapters.System.Clock)).toEqual(
      tools.Duration.Ms(431999999),
    );
  });

  test("ALL_TIME", async () => {
    expect(new AI.QuotaWindow(AI.QuotaWindowEnum.ALL_TIME).resetsIn(di.Adapters.System.Clock)).toEqual(
      tools.Duration.Ms(Number.MAX_SAFE_INTEGER),
    );
  });
});
