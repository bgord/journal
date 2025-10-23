type TranslationsType = Record<string, string>;
type LanguageType = string;

type TranslationsResponseType = { translations: TranslationsType; language: LanguageType };

export async function getTranslationsServer(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";

  const response = await fetch(new URL("/api/translations", request.url), {
    headers: { cookie },
    credentials: "include",
  });

  if (!response?.ok) return null;

  return await response.json().catch();
}

export async function getTranslationsClient() {
  const response = await fetch("/api/translations", { credentials: "include" });

  if (!response?.ok) return null;

  return await response.json().catch();
}

export async function getTranslations(request: Request | null): Promise<TranslationsResponseType | null> {
  if (request) return getTranslationsServer(request);
  return getTranslationsClient();
}
