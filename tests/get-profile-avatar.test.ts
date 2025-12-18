import { describe, expect, spyOn, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/profile-avatar/get";

describe(`GET ${url}`, async () => {
  const di = await bootstrap();
  const server = createServer(di);

  test("AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const body = await response.json();

    expect(response.status).toEqual(403);
    expect(body._known).toEqual(true);
  });

  test("404 when object does not exist (head.exists=false)", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const remoteFileStorageHead = spyOn(di.Adapters.System.RemoteFileStorage, "head").mockResolvedValue({
      exists: false,
    });

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(remoteFileStorageHead).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(404);
  });

  test("304 when If-None-Match matches current ETag", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.System.RemoteFileStorage, "head").mockResolvedValue(mocks.head);
    const remoteFileStorageGetStream = spyOn(di.Adapters.System.RemoteFileStorage, "getStream");

    const response = await server.request(
      url,
      { method: "GET", headers: { "If-None-Match": mocks.head.etag.get() } },
      mocks.ip,
    );

    expect(response.status).toEqual(304);
    expect(remoteFileStorageGetStream).not.toHaveBeenCalled();
  });

  test("200 streams avatar with correct headers", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.System.RemoteFileStorage, "head").mockResolvedValue(mocks.head);
    const fakeStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3, 4, 5]));
        controller.close();
      },
    });
    spyOn(di.Adapters.System.RemoteFileStorage, "getStream").mockResolvedValue(fakeStream);

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(200);
    expect(response.headers.get("Content-Type")).toEqual("image/webp");
    expect(response.headers.get("ETag")).toEqual(mocks.head.etag.get());
    expect(response.headers.get("Content-Length")).toEqual(mocks.head.size.toBytes().toString());
    expect(response.headers.get("Last-Modified")).toEqual(new Date(mocks.head.lastModified.ms).toUTCString());
    +expect(response.headers.get("Cache-Control")).toEqual("private, max-age=0, must-revalidate");

    const buffer = await response.arrayBuffer();

    expect(new Uint8Array(buffer)).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
  });

  test("404 when stream is not available even if head.exists=true", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.System.RemoteFileStorage, "head").mockResolvedValue(mocks.head);
    spyOn(di.Adapters.System.RemoteFileStorage, "getStream").mockResolvedValue(null);

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toEqual(404);
  });
});
