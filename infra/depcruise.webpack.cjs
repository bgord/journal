/* depcruise.webpack.cjs */
const path = require("node:path");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "+infra": path.resolve(__dirname, "infra"),
      "+app": path.resolve(__dirname, "app"),
      "+languages": path.resolve(__dirname, "modules/languages.ts"),
      "+auth": path.resolve(__dirname, "modules/auth"),
      "+emotions": path.resolve(__dirname, "modules/emotions"),
      "+publishing": path.resolve(__dirname, "modules/publishing"),
      "+ai": path.resolve(__dirname, "modules/ai"),
      "+system": path.resolve(__dirname, "modules/system"),
      "+preferences": path.resolve(__dirname, "modules/preferences"),
    },
  },
};
