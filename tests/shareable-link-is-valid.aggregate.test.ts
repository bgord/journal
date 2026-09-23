import { describe, expect, test } from "bun:test";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.isValid", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path - true", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(true);
  });

  test("happy path - false - expired", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(false);
  });

  test("happy path - false - revoked", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(false);
  });

  test("happy path - false - specification", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(shareableLink.isValid("other")).toEqual(false);
  });
});
