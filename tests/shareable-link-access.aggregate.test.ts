import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.access", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.access("entries")).toEqual(Publishing.VO.ShareableLinkAccessReason.active);
  });

  test("happy path - expired", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(shareableLink.access("entries")).toEqual(Publishing.VO.ShareableLinkAccessReason.expired);
  });

  test("happy path - expiration time passed", async () => {
    using _ = spyOn(di.Adapters.System.Clock, "now").mockReturnValue(mocks.T0.add(tools.Duration.Hours(1)));
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.access("entries")).toEqual(Publishing.VO.ShareableLinkAccessReason.expired);
  });

  test("happy path - revoked", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(shareableLink.access("entries")).toEqual(Publishing.VO.ShareableLinkAccessReason.revoked);
  });

  test("happy path - wrong specification", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.access("other")).toEqual(
      Publishing.VO.ShareableLinkAccessReason.wrong_specification_publication,
    );
  });
});
