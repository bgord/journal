import { describe, expect, test } from "bun:test";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.build", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", () => {
    expect(Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [], deps).pullEvents()).toEqual(
      [],
    );
  });
});
