import { Cookies, type ETagValueType } from "@bgord/ui";
import { absoluteUrl } from "./url";

/** @public */
export type AvatarEtagType = ETagValueType;

export class Avatar {
  private static readonly BASE = "/api/profile-avatar/get";

  static async getEtag(request: Request | null): Promise<AvatarEtagType | null> {
    console.log(request);
    const url = absoluteUrl(Avatar.BASE, request);
    console.log(url);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;
    console.log(headers);

    const response = await fetch(url, { headers, credentials: "include" });
    console.log(response);

    if (!response?.ok) return null;
    return response.headers.get("etag");
  }
}
