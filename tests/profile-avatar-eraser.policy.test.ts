import { describe, expect, spyOn, test } from "bun:test";
import * as Preferences from "+preferences";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ProfileAvatarEraser", async () => {
  const di = await bootstrap();

  const policy = new Preferences.Policies.ProfileAvatarEraser({ ...di.Adapters.System, ...di.Tools });

  test("onAccountDeletedEvent", async () => {
    using remoteFileStorageDelete = spyOn(di.Adapters.System.RemoteFileStorage, "delete");

    await policy.onAccountDeletedEvent(mocks.GenericAccountDeletedEvent);

    expect(remoteFileStorageDelete).toHaveBeenCalledWith(
      Preferences.VO.ProfileAvatarKeyFactory.stable(mocks.userId),
    );
  });
});
