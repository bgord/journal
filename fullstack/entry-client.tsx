import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import { createRouter, type RouterContext } from "./router";

const router = createRouter({} as RouterContext);

hydrateRoot(document.getElementById("root")!, <RouterClient router={router} />);
