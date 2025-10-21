import { hydrate } from "preact-iso";
import { AppShell } from "./app";

hydrate(<AppShell />, document.getElementById("root")!);
