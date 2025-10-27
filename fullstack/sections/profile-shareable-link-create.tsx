import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";

export function ProfileShareableLinkCreate() {
  const t = UI.useTranslations();

  const dialog = UI.useToggle({ name: "dialog" });

  return (
    <button
      type="button"
      className="c-button"
      data-variant="with-icon"
      data-ml="auto"
      onClick={dialog.enable}
    >
      <Icons.Plus data-size="md" />
      {t("profile.shareable_links.create.cta_primary")}
    </button>
  );
}
