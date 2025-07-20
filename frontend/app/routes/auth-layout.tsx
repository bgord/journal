import * as UI from "@bgord/ui";
import { ProfileCircle } from "iconoir-react";
import { Link, Outlet } from "react-router";
import * as Auth from "../../auth";
import { LogoutButton } from "../../components/logout-button";
import type { Route } from "./+types/auth-layout";

export async function loader({ request }: Route.LoaderArgs) {
  return Auth.guard.requireSession(request);
}

export default function AuthLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div data-display="flex" data-direction="column">
      <div data-display="flex" data-main="end" data-cross="center" data-gap="24" data-mb="24">
        <Link
          className="c-button"
          data-variant="bare"
          type="button"
          to="/dashboard"
          data-display="flex"
          data-cross="center"
        >
          Dashboard
        </Link>

        <div
          data-display="flex"
          data-cross="center"
          data-gap="6"
          data-fs="14"
          {...UI.Colorful("brand-600").style.color}
        >
          <ProfileCircle height={20} width={20} /> {loaderData?.user.email}
        </div>

        <LogoutButton />
      </div>
      <Outlet context={loaderData} />;
    </div>
  );
}
