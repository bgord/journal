import * as bg from "@bgord/ui";

export class I18N {
  static async get(request: Request | null): Promise<bg.TranslationsContextValueType | null> {
    return bg.ApiClient.json<bg.TranslationsContextValueType | null>("/api/translations", request, null);
  }
}
