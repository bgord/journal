import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import * as Adapters from "+infra/adapters";
import { EventBus } from "+infra/event-bus";
import { logger } from "+infra/logger.adapter";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Preferences.Policies.ProfileAvatarCleaner(
  EventBus,
  EventHandler,
  Adapters.RemoteFileStorage,
);

describe("ProfileAvatarCleaner", () => {
  test("onProfileAvatarRemovedEvent", async () => {
    const remoteFileStorageDelete = spyOn(Adapters.RemoteFileStorage, "delete").mockImplementation(jest.fn());
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onProfileAvatarRemovedEvent(mocks.GenericProfileAvatarRemovedEvent);
    });
    expect(remoteFileStorageDelete).toHaveBeenCalledWith(mocks.objectKey);
  });
});
