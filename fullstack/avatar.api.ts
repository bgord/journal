import { Cookies, type ETagValueType } from "@bgord/ui";

export type AvatarEtagType = ETagValueType;

async function getAvatarEtagServer(request: Request) {
  const response = await fetch(new URL("/api/profile-avatar/get", request.url), {
    headers: { cookie: Cookies.extractFrom(request) },
    credentials: "include",
  });

  if (!response?.ok) return null;

  return response.headers.get("etag");
}

async function getAvatarEtagClient() {
  const response = await fetch("/api/profile-avatar/get", { credentials: "include" });

  if (!response?.ok) return null;

  return response.headers.get("etag");
}

export async function getAvatarEtag(request: Request | null): Promise<AvatarEtagType | null> {
  if (request) return getAvatarEtagServer(request);
  return getAvatarEtagClient();
}
