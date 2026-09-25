import * as bg from "@bgord/ui";

export type AvatarEtagType = bg.ETagValueType;

export class Avatar {
  static async getEtag(request: Request | null): Promise<AvatarEtagType | null> {
    const response = await bg.ApiClient.fetch("/api/profile-avatar/get", request);

    if (!response.ok) return null;
    return response.headers.get("etag");
  }
}
