import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import { RemoteFileStorage } from "+infra/adapters/remote-file-storage";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/profile-avatar/get";

describe(`GET ${url}`, () => {
  test("AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body._known).toBe(true);
  });

  test("404 when object does not exist (head.exists=false)", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const headSpy = spyOn(RemoteFileStorage, "head").mockResolvedValue({ exists: false });
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    expect(headSpy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(404);
  });

  test("304 when If-None-Match matches current ETag", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    const etag = "etag-123";
    const size = tools.Size.fromBytes(1234);
    const lastModified = tools.Timestamp.parse(Date.UTC(2024, 1, 2, 3, 4, 5));
    const mime = new tools.Mime("image/webp");

    spyOn(RemoteFileStorage, "head").mockResolvedValue({
      exists: true,
      etag,
      size,
      lastModified,
      mime,
    });
    const getStreamSpy = spyOn(RemoteFileStorage, "getStream");

    const response = await server.request(
      url,
      { method: "GET", headers: { "If-None-Match": etag } },
      mocks.ip,
    );

    expect(response.status).toBe(304);
    expect(getStreamSpy).not.toHaveBeenCalled();
  });

  test("200 streams avatar with correct headers", async () => {
    // auth ok
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    const etag = "e1";
    const size = tools.Size.fromBytes(5);
    const lastModified = tools.Timestamp.parse(Date.UTC(2024, 0, 1, 0, 0, 0));
    const mime = new tools.Mime("image/webp");

    // head says it exists
    spyOn(RemoteFileStorage, "head").mockResolvedValue({
      exists: true,
      etag,
      size,
      lastModified,
      mime,
    });

    // finite stream: enqueue 5 bytes and close
    const fakeStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3, 4, 5]));
        controller.close();
      },
    });
    spyOn(RemoteFileStorage, "getStream").mockResolvedValue(fakeStream);

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    expect(response.headers.get("ETag")).toBe(etag);
    expect(response.headers.get("Content-Length")).toBe("5");
    expect(response.headers.get("Last-Modified")).toBe(new Date(lastModified).toUTCString());
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");

    // (optional) read to ensure stream is consumable and closed
    const arrBuf = await response.arrayBuffer();
    expect(new Uint8Array(arrBuf)).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
  });

  test("404 when stream is not available even if head.exists=true", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    spyOn(RemoteFileStorage, "head").mockResolvedValue({
      exists: true,
      etag: "e",
      size: tools.Size.fromBytes(1),
      lastModified: tools.Timestamp.parse(Date.now()),
      mime: new tools.Mime("image/webp"),
    });
    spyOn(RemoteFileStorage, "getStream").mockResolvedValue(null);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    expect(response.status).toBe(404);
  });
});
