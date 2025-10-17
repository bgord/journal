import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import { createRouter, type RouterContext } from "./router";

const router = createRouter({ user: null } as RouterContext);

hydrateRoot(document, <RouterClient router={router} />);
