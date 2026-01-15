const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { join } = require("path");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  output: {
    path: isProduction
      ? join(__dirname, "../../netlify/functions/server")
      : join(__dirname, "../../dist/apps/server"),
    filename: isProduction ? "server.js" : "main.js",
    libraryTarget: isProduction ? "commonjs2" : undefined,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: "node",
      compiler: "tsc",
      main: isProduction ? "./netlify/server.ts" : "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: "none",
      generatePackageJson: true,
    }),
  ],
};
