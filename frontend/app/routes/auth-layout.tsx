import { ProfileCircle } from "iconoir-react";
import { Link, Outlet } from "react-router";
import * as Auth from "../../auth";
import * as Components from "../../components";
import type { Route } from "./+types/auth-layout";

export async function loader({ request }: Route.LoaderArgs) {
  return Auth.guard.requireSession(request);
}

export default function AuthLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div data-display="flex" data-direction="column">
      <div data-display="flex" data-main="end" data-cross="center" data-gap="5" data-mb="5">
        <Link
          data-variant="bare"
          data-fs="sm"
          data-color="brand-300"
          type="button"
          to="/dashboard"
          data-display="flex"
          data-cross="center"
          data-transform="uppercase"
        >
          Dashboard
        </Link>

        <div
          data-display="flex"
          data-cross="center"
          data-gap="3"
          data-fs="base"
          data-fw="medium"
          data-color="brand-200"
        >
          <ProfileCircle height={20} width={20} /> {loaderData?.user.email}
        </div>

        <Components.LogoutButton />
      </div>
      <Outlet context={loaderData} />;
    </div>
  );
}
