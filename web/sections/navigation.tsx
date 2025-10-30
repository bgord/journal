import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import * as UI from "../components";

export function Navigation() {
  const t = useTranslations();

  return (
    <nav data-stack="x" data-cross="center" data-gap="6" data-p="3">
      <UI.Logo />

      <Link to="/dashboard" className="c-link" data-transform="uppercase" data-ml="auto">
        {t("app.dashboard")}
      </Link>

      <Link to="/profile" data-fs="base" data-fw="medium">
        <UI.Avatar size={UI.AvatarSize.small} />
      </Link>

      <form action="/api/auth/sign-out" method="post">
        <button className="c-link" type="submit">
          {t("auth.logout.cta")}
        </button>
      </form>
    </nav>
  );
}
