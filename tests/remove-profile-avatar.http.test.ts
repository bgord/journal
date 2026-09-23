import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/preferences/profile-avatar";

describe(`DELETE ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);
    await testcases.assertAuthResponse(response);
  });

  test("happy path", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    using remoteFileStorageDelete = spyOn(di.Adapters.System.RemoteFileStorage, "delete");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(202);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarRemovedEvent]);
    expect(remoteFileStorageDelete).toHaveBeenCalledWith(mocks.objectKey);
  });
});
