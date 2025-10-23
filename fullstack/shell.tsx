import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Navigation } from "./navigation";

export function Shell() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body data-mx="auto" data-bg="neutral-950">
        <div id="root">
          <Navigation />
          <Outlet />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
