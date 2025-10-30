import { Cookies, type ETagValueType } from "@bgord/ui";

/** @public */
export type AvatarEtagType = ETagValueType;

export class Avatar {
  private static readonly BASE = "/api/profile-avatar/get";

  static async getEtag(request: Request | null): Promise<AvatarEtagType | null> {
    console.log(request);
    const url = request ? new URL(Avatar.BASE, request.url) : Avatar.BASE;
    console.log(url);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;
    console.log(headers);

    const response = await fetch(url.toString().replace("http", "https"), {
      headers,
      credentials: "include",
    });
    console.log(response);

    if (!response?.ok) return null;
    return response.headers.get("etag");
  }
}
