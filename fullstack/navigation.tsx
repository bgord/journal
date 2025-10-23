import { useTranslations } from "@bgord/ui";
import { Link, useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "./router";

export function Navigation() {
  const { session } = useLoaderData({ from: rootRoute.id });
  const t = useTranslations();

  return (
    <nav data-stack="y">
      <header data-stack="x" data-cross="center" data-gap="6" data-p="3">
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
          <img
            src="/profile-avatar/get"
            title={session.user.email}
            alt={t("profile.avatar.alt")}
            width={48}
            height={48}
            style={{ borderRadius: 9999, objectFit: "cover" }}
            data-bc="neutral-700"
            data-bwb="hairline"
          />
        </Link>

        <form action="/api/auth/sign-out" method="post">
          <button className="c-link" type="submit">
            {t("auth.logout.cta")}
          </button>
        </form>
      </header>
    </nav>
  );
}
