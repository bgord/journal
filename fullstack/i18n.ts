type TranslationsType = Record<string, string>;
type LanguageType = string;

type I18nType = { translations: TranslationsType; language: LanguageType };

async function getI18nServer(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";

  const response = await fetch(new URL("/api/translations", request.url), {
    headers: { cookie },
    credentials: "include",
  });

  if (!response?.ok) return null;

  return await response.json().catch();
}

async function getI18nClient() {
  const response = await fetch("/api/translations", { credentials: "include" });

  if (!response?.ok) return null;

  return await response.json().catch();
}

export async function getI18n(request: Request | null): Promise<I18nType | null> {
  if (request) return getI18nServer(request);
  return getI18nClient();
}
