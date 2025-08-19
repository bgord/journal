import { describe, expect, spyOn, test } from "bun:test";
import { ShareableLinkAccess } from "+infra/adapters/publishing";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

describe("ShareableLinkAccess", () => {
  test("true", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);

    expect(
      (await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext)).valid,
    ).toEqual(true);
  });

  test("false - not found", async () => {
    spyOn(EventStore, "find").mockResolvedValue([]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - expired", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - revoked", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - specification", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "other", mocks.accessContext)).toEqual({
      valid: false,
    });
  });
});
