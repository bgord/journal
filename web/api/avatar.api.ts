import { Cookies, type ETagValueType } from "@bgord/ui";
import { absoluteUrl } from "./url";

/** @public */
export type AvatarEtagType = ETagValueType;

export class Avatar {
  private static readonly BASE = "/api/profile-avatar/get";

  static async getEtag(request: Request | null): Promise<AvatarEtagType | null> {
    const url = absoluteUrl(Avatar.BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.headers.get("etag");
  }
}
