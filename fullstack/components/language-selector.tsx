import { useLanguage, useSupportedLanguages, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import Cookie from "js-cookie";
import { rootRoute } from "../router";
import { Select } from "./select";

export function LanguageSelector() {
  const router = useRouter();
  const language = useLanguage();
  const supportedLanguages = useSupportedLanguages();
  const t = useTranslations();

  return (
    <div data-stack="x" data-cross="center" data-gap="3">
      <Select
        data-disp="flex"
        defaultValue={language}
        onChange={async (event) => {
          Cookie.set("language", event.target.value);
          await router.invalidate({ filter: (r) => r.routeId === rootRoute.id, sync: true });
        }}
      >
        {Object.keys(supportedLanguages).map((language) => (
          <option key={language} value={language}>
            {t(`profile.change_language.${language}.value`)}
          </option>
        ))}
      </Select>
    </div>
  );
}
