import { describe, expect, test } from "bun:test";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.isEmpty", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path - true", () => {
    expect(Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [], deps).isEmpty()).toEqual(
      true,
    );
  });

  test("happy path - false", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.isEmpty()).toEqual(false);
  });
});
