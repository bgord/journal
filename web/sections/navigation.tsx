import { useScrollLock, useToggle, useTranslations, useWindowDimensions } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Menu, Xmark } from "iconoir-react";
import { Avatar, AvatarSize, Logo } from "../components";

export function Navigation() {
  const { width } = useWindowDimensions();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobile />;
  return <NavigationDesktop />;
}

function NavigationDesktop() {
  const t = useTranslations();

  return (
    <nav data-stack="x" data-cross="center" data-gap="6" data-p="2" style={{ height: "70px" }}>
      <Logo />

      <Link to="/dashboard" className="c-link" data-transform="uppercase" data-ml="auto">
        {t("app.dashboard")}
      </Link>

      <Link to="/profile" className="c-link" data-focus-ring="neutral" data-fw="medium">
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

      {navigation.on && (
        <nav
          data-disp="flex"
          data-dir="column"
          data-wrap="nowrap"
          data-overflow="auto"
          data-position="fixed"
          data-inset="0"
          data-z="1"
          data-bg="neutral-950"
          {...navigation.props.target}
        >
          <div data-disp="flex" data-main="between" data-cross="center" data-p="2" style={{ height: "70px" }}>
            <Logo />

            <button
              type="button"
              className="c-button"
              data-variant="bare"
              title={t("app.menu.close")}
              onClick={navigation.disable}
              data-interaction="subtle-scale"
              {...navigation.props.controller}
            >
              <Xmark data-color="white" height="24" width="24" />
            </button>
          </div>

          <div
            data-disp="flex"
            data-dir="column"
            data-cross="center"
            data-gap="6"
            data-mt="12"
            data-animation="grow-fade-in"
          >
            <Link to="/profile" onClick={navigation.disable} data-fs="base" data-fw="medium">
              <Avatar size={AvatarSize.small} />
            </Link>

            <Link to="/dashboard" onClick={navigation.disable} className="c-link" data-transform="uppercase">
              {t("app.dashboard")}
            </Link>

            <Link to="/profile" onClick={navigation.disable} className="c-link" data-transform="uppercase">
              {t("app.profile")}
            </Link>

            <NavigationLogout data-mt="8" />
          </div>
        </nav>
      )}
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
