// cspell:disable
import { Schema, ValidateEnv } from "@julr/vite-plugin-validate-env";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    ValidateEnv({ validator: "builtin", schema: { VITE_API_URL: Schema.string() } }),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    // alias: {
    //   "react-dom/server": "react-dom/server.node",
    // },
  },
});
