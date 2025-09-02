import * as UI from "@bgord/ui";
import * as RR from "react-router";
import * as Auth from "../../auth";
import * as Components from "../../components";
import type { Route } from "./+types/auth-layout";

export async function loader({ request }: Route.LoaderArgs) {
  return Auth.guard.requireSession(request);
}

export default function AuthLayout({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();

  return (
    <div data-stack="y">
      <header data-stack="x" data-cross="center" data-gap="6" data-p="3">
        <Components.Logo />

        <RR.Link
          to="/dashboard"
          prefetch="intent"
          className="c-link"
          data-transform="uppercase"
          data-ml="auto"
        >
          Dashboard
        </RR.Link>

        <RR.Link
          to="/profile"
          prefetch="intent"
          className="c-link"
          data-disp="flex"
          data-cross="center"
          data-gap="2"
          data-fs="base"
          data-fw="medium"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/profile-avatar/get`}
            alt={t("profile.avatar.alt")}
            width={48}
            height={48}
            style={{ borderRadius: 9999, objectFit: "cover" }}
            data-bc="neutral-700"
            data-bwb="hairline"
          />
        </RR.Link>

        <Components.LogoutButton />
      </header>
      <RR.Outlet context={loaderData} />
    </div>
  );
}
