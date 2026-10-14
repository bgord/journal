import { describe, expect, test } from "bun:test";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.summarize", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("ShareableLinkExists", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [], deps);

    expect(() => shareableLink.summarize()).toThrow(Publishing.Invariants.ShareableLinkExists.error);
  });

  test("happy path", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    const summary = shareableLink.summarize();

    expect(summary).toEqual({
      ownerId: mocks.userId,
      dateRange: mocks.dateRange,
      publicationSpecification: mocks.publicationSpecification,
      status: Publishing.VO.ShareableLinkStatusEnum.active,
    });
  });
});
