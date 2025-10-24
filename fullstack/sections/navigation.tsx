import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarSize } from "../components/avatar";

export function Navigation() {
  const t = useTranslations();

  return (
    <nav data-stack="x" data-cross="center" data-gap="6" data-p="3">
      <div className="logo" data-fs="4xl" data-fw="bold" data-ls="wider" data-color="brand-600">
        <Link to="/">{t("app.name")}</Link>
      </div>

      <Link to="/dashboard" className="c-link" data-transform="uppercase" data-ml="auto">
        {t("app.dashboard")}
      </Link>

      <Link
        to="/profile"
        className="c-link"
        data-disp="flex"
        data-cross="center"
        data-gap="2"
        data-fs="base"
        data-fw="medium"
      >
        <Avatar size={AvatarSize.small} />
      </Link>

      <form action="/api/auth/sign-out" method="post">
        <button className="c-link" type="submit">
          {t("auth.logout.cta")}
        </button>
      </form>
    </nav>
  );
}
