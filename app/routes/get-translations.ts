import * as bg from "@bgord/bun";
import hono from "hono";

export async function GetTranslations(c: hono.Context, _next: hono.Next) {
  const language = c.get("language");
  const translations = await new bg.I18n().getTranslations(language);

  return c.json({ translations, language });
}
