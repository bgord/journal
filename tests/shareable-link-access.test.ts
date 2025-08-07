import { describe, expect, spyOn, test } from "bun:test";
import { EventStore } from "../infra/event-store";
import * as Publishing from "../modules/publishing";
import * as mocks from "./mocks";

describe("ShareableLinkAccess", () => {
  test("true", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);

    expect((await Publishing.OHQ.ShareableLinkAccess.check(mocks.shareableLinkId)).valid).toEqual(true);
  });

  test("false - not found", async () => {
    spyOn(EventStore, "find").mockResolvedValue([]);

    expect(await Publishing.OHQ.ShareableLinkAccess.check(mocks.shareableLinkId)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - expired", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);

    expect(await Publishing.OHQ.ShareableLinkAccess.check(mocks.shareableLinkId)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - revoked", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);

    expect(await Publishing.OHQ.ShareableLinkAccess.check(mocks.shareableLinkId)).toEqual({
      valid: false,
    });
  });
});
