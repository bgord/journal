/* depcruise.webpack.cjs */
const path = require("node:path");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "+app": path.resolve(__dirname, "app"),
      "+infra": path.resolve(__dirname, "infra"),
      "+ai": path.resolve(__dirname, "modules/ai"),
      "+auth": path.resolve(__dirname, "modules/auth"),
      "+emotions": path.resolve(__dirname, "modules/emotions"),
      "+publishing": path.resolve(__dirname, "modules/publishing"),
      "+languages": path.resolve(__dirname, "modules/supported-languages.ts"),
    },
  },
};
