import { Cookies, useLanguage, useSupportedLanguages, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { Select } from "./select";

export function LanguageSelector() {
  const router = useRouter();
  const language = useLanguage();
  const supportedLanguages = useSupportedLanguages();
  const t = useTranslations();

  return (
    <Select
      defaultValue={language}
      onChange={async (event) => {
        Cookies.set("language", event.target.value);
        await router.invalidate({ filter: (r) => r.routeId === rootRoute.id, sync: true });
      }}
    >
      {Object.keys(supportedLanguages).map((language) => (
        <option key={language} value={language}>
          {t(`profile.change_language.${language}.value`)}
        </option>
      ))}
    </Select>
  );
}
