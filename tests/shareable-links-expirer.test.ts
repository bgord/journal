import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventStore } from "../infra/event-store";
import * as Publishing from "../modules/publishing";
import * as mocks from "./mocks";

describe("WeeklyReviewScheduler", () => {
  test("validation - ShareableLinkIsActive - already revoked", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Publishing.Repos.ShareableLinkRepository, "listNearExpiration").mockResolvedValue([
      mocks.shareableLink,
    ]);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Publishing.Services.ShareableLinksExpirer.process();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - ShareableLinkIsActive - already expired", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Publishing.Repos.ShareableLinkRepository, "listNearExpiration").mockResolvedValue([
      mocks.shareableLink,
    ]);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Publishing.Services.ShareableLinksExpirer.process();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - ShareableLinkExpirationTimePassed", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Date, "now").mockReturnValue(Date.now() + mocks.duration.ms + 1);
    spyOn(Publishing.Repos.ShareableLinkRepository, "listNearExpiration").mockResolvedValue([
      mocks.shareableLink,
    ]);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Publishing.Services.ShareableLinksExpirer.process();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("repository failure", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Publishing.Repos.ShareableLinkRepository, "listNearExpiration").mockImplementation(() => {
      throw new Error("FAILURE");
    });
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Publishing.Services.ShareableLinksExpirer.process();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no links", async () => {
    spyOn(Publishing.Repos.ShareableLinkRepository, "listNearExpiration").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Publishing.Services.ShareableLinksExpirer.process();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Publishing.Repos.ShareableLinkRepository, "listNearExpiration").mockResolvedValue([
      mocks.shareableLink,
    ]);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Publishing.Services.ShareableLinksExpirer.process();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkExpiredEvent]);
  });
});
