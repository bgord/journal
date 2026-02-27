import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/preferences/profile-avatar/update";

const form = new FormData();
form.append("file", new File(["image"], "image.png"));

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("ProfileAvatarConstraints - maxSide - width", async () => {
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
        width: tools.ImageWidth.parse(4100),
        height: tools.ImageHeight.parse(100),
        mime: tools.Mimes.png.mime,
        size: tools.Size.fromKb(100),
      }),
    );
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "profile.avatar.constraints");
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("ProfileAvatarConstraints - maxSide - height", async () => {
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
        width: tools.ImageWidth.parse(100),
        height: tools.ImageHeight.parse(4100),
        mime: tools.Mimes.png.mime,
        size: tools.Size.fromKb(100),
      }),
    );
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "profile.avatar.constraints");
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("ProfileAvatarConstraints - size", async () => {
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
        width: tools.ImageWidth.parse(100),
        height: tools.ImageHeight.parse(100),
        mime: tools.Mimes.png.mime,
        size: tools.Size.fromMB(100),
      }),
    );
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "profile.avatar.constraints");
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("ProfileAvatarConstraints - mime", async () => {
    using temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    using temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
        width: tools.ImageWidth.parse(100),
        height: tools.ImageHeight.parse(100),
        mime: tools.Mimes.text.mime,
        size: tools.Size.fromKb(100),
      }),
    );
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(url, { method: "POST", body: form }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "profile.avatar.constraints");
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("happy path - png", async () => {
    using imageProcessorProcess = spyOn(di.Adapters.System.ImageProcessor, "process");
    using remoteFileStoragePutFromPath = spyOn(di.Adapters.System.RemoteFileStorage, "putFromPath");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
        width: tools.ImageWidth.parse(4000),
        height: tools.ImageHeight.parse(4000),
        mime: tools.Mimes.png.mime,
        size: tools.Size.fromKb(100),
      }),
    );
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      { method: "POST", body: form, headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
    expect(imageProcessorProcess).toHaveBeenCalledWith({
      maxSide: 256,
      strategy: "in_place",
      to: "webp",
      // @ts-expect-error
      input: expect.any(tools.FilePathAbsolute),
    });
    expect(remoteFileStoragePutFromPath).toHaveBeenCalledWith({
      key: mocks.objectKey,
      // @ts-expect-error
      path: expect.any(tools.FilePathAbsolute),
    });
  });

  test("happy path - jpeg", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
        width: tools.ImageWidth.parse(100),
        height: tools.ImageHeight.parse(100),
        mime: tools.Mimes.jpg.mime,
        size: tools.Size.fromKb(100),
      }),
    );
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      { method: "POST", body: form, headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
  });

  test("happy path - webp", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
        width: tools.ImageWidth.parse(100),
        height: tools.ImageHeight.parse(100),
        mime: tools.Mimes.webp.mime,
        size: tools.Size.fromKb(100),
      }),
    );
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));

    const response = await server.request(
      url,
      { method: "POST", body: form, headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
  });
});
