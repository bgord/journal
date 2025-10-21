import { hydrate } from "preact-iso";
import { App, type AppProps } from "./app";

// @ts-expect-error
const state = window?.__STATE__ as AppProps;

hydrate(<App {...state} />, document.querySelector("#root")!);
