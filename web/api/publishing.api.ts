import { Cookies } from "@bgord/ui";
import type { ShareableLinkSnapshot } from "../../modules/publishing/value-objects";
import { absoluteUrl } from "./url";

export class Publishing {
  private static readonly BASE = "/api/publishing/links/list";

  static async listShareableLinks(request: Request | null): Promise<ShareableLinkSnapshot[]> {
    const url = absoluteUrl(Publishing.BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }
}

export type { ShareableLinkSnapshot } from "../../modules/publishing/value-objects";
