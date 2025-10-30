import type { TranslationsContextValueType } from "@bgord/ui";
import { Cookies } from "@bgord/ui";
import { absoluteUrl } from "./url";

export class I18N {
  private static readonly BASE = "/api/translations";

  static async get(request: Request | null): Promise<TranslationsContextValueType | null> {
    const url = absoluteUrl(I18N.BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
