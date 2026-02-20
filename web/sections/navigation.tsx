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
    <nav data-cross="center" data-gap="6" data-p="2" data-stack="x" style={{ height: "70px" }}>
      <Logo />

      <Link className="c-link" data-ml="auto" data-transform="uppercase" to="/dashboard">
        {t("app.dashboard")}
      </Link>

      <Link className="c-link" data-focus-ring="neutral" data-fw="medium" to="/profile">
        <Avatar size={AvatarSize.md} />
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
      <nav data-cross="center" data-disp="flex" data-main="between" data-p="2" style={{ height: "70px" }}>
        <Logo />

        <div data-cross="center" data-gap="3" data-stack="x">
          <Avatar size={AvatarSize.sm} />
          <button
            className="c-button"
            data-variant="bare"
            onClick={navigation.enable}
            title={t("app.menu.show")}
            type="button"
            {...navigation.props.controller}
          >
            <Menu data-color="white" height="24" width="24" />
          </button>
        </div>
      </nav>

      {navigation.on && (
        <nav
          data-bg="neutral-950"
          data-dir="column"
          data-disp="flex"
          data-inset="0"
          data-overflow="auto"
          data-position="fixed"
          data-wrap="nowrap"
          data-z="1"
          {...navigation.props.target}
        >
          <div data-cross="center" data-disp="flex" data-main="between" data-p="2" style={{ height: "70px" }}>
            <Logo />

            <button
              className="c-button"
              data-interaction="subtle-scale"
              data-variant="bare"
              onClick={navigation.disable}
              title={t("app.menu.close")}
              type="button"
              {...navigation.props.controller}
            >
              <Xmark data-color="white" height="24" width="24" />
            </button>
          </div>

          <div
            data-animation="grow-fade-in"
            data-cross="center"
            data-dir="column"
            data-disp="flex"
            data-gap="6"
            data-mt="12"
          >
            <Link data-fs="base" data-fw="medium" onClick={navigation.disable} to="/profile">
              <Avatar size={AvatarSize.sm} />
            </Link>

            <Link className="c-link" data-transform="uppercase" onClick={navigation.disable} to="/dashboard">
              {t("app.dashboard")}
            </Link>

            <Link className="c-link" data-transform="uppercase" onClick={navigation.disable} to="/profile">
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
    <nav data-cross="center" data-disp="flex" data-p="2" style={{ height: "70px" }}>
      <Logo />
    </nav>
  );
}

function NavigationLogout(props: React.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  return (
    <button
      className="c-link"
      onClick={async () => {
        await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
        location.replace("/public/login.html");
      }}
      type="button"
      {...props}
    >
      {t("auth.logout.cta")}
    </button>
  );
}
