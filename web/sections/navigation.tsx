import { useScrollLock, useToggle, useTranslations, useWindowDimensions } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Menu } from "iconoir-react";
import { Avatar, AvatarSize, Logo } from "../components";

export function Navigation() {
  const { width } = useWindowDimensions();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobile />;
  return <NavigationDesktop />;
}

export function NavigationDesktop() {
  const t = useTranslations();

  return (
    <nav data-stack="x" data-cross="center" data-gap="6" data-p="2" style={{ height: "70px" }}>
      <Logo />

      <Link to="/dashboard" className="c-link" data-transform="uppercase" data-ml="auto">
        {t("app.dashboard")}
      </Link>

      <Link to="/profile" data-fs="base" data-fw="medium">
        <Avatar size={AvatarSize.small} />
      </Link>

      <NavigationLogout />
    </nav>
  );
}

function NavigationMobile() {
  const navigation = useToggle({ name: "navigation" });
  const t = useTranslations();

  useScrollLock(navigation.on);

  return (
    <>
      <nav data-disp="flex" data-main="between" data-cross="center" data-p="2" style={{ height: "70px" }}>
        <Logo />

        <button
          type="button"
          className="c-button"
          data-variant="bare"
          title={t("app.menu.show")}
          onClick={navigation.enable}
          {...navigation.props.controller}
        >
          <Menu data-color="white" height="24" width="24" />
        </button>
      </nav>
    </>
  );
}

function NavigationShell() {
  return (
    <nav data-disp="flex" data-cross="center" data-p="2" style={{ height: "70px" }}>
      <Logo />
    </nav>
  );
}

function NavigationLogout(props: React.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  return (
    <button
      type="button"
      className="c-link"
      onClick={async () => {
        await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
        location.replace("/public/login.html");
      }}
      {...props}
    >
      {t("auth.logout.cta")}
    </button>
  );
}
