import * as Icons from "iconoir-react";
import * as RR from "react-router";
import * as Auth from "../../auth";
import * as Components from "../../components";
import type { Route } from "./+types/auth-layout";

export async function loader({ request }: Route.LoaderArgs) {
  return Auth.guard.requireSession(request);
}

export default function AuthLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div data-disp="flex" data-dir="column">
      <header data-disp="flex" data-cross="center" data-gap="6" data-p="3">
        <Components.Logo />

        <RR.Link className="c-link" to="/dashboard" data-transform="uppercase" data-ml="auto">
          Dashboard
        </RR.Link>

        <div
          data-disp="flex"
          data-cross="center"
          data-gap="2"
          data-fs="base"
          data-fw="medium"
          data-color="neutral-300"
        >
          <Icons.ProfileCircle data-size="md" /> {loaderData?.user.email}
        </div>

        <Components.LanguageSelector />

        <Components.LogoutButton />
      </header>
      <RR.Outlet context={loaderData} />;
    </div>
  );
}
