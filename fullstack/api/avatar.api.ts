import { Cookies, type ETagValueType } from "@bgord/ui";

export type AvatarEtagType = ETagValueType;

export class Avatar {
  private static readonly BASE = "/api/profile-avatar/get";

  static async getEtag(request: Request | null): Promise<AvatarEtagType | null> {
    const url = request ? new URL(Avatar.BASE, request.url) : Avatar.BASE;
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.headers.get("etag");
  }
}
