import type { TranslationsContextValueType } from "@bgord/ui";
import { Cookies } from "@bgord/ui";

export class I18N {
  private static readonly BASE = "/api/translations";

  static async get(request: Request | null): Promise<TranslationsContextValueType | null> {
    const url = request ? new URL(I18N.BASE, request.url) : I18N.BASE;
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
