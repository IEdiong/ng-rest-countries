const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  output: {
    path: isProduction
      ? path.resolve(__dirname, "../../netlify/functions") // ✅ Changed:  output directly to functions directory
      : path.resolve(__dirname, "../../dist/apps/server"),
    filename: isProduction ? "server.js" : "main.js", // ✅ This will create netlify/functions/server.js
    libraryTarget: isProduction ? "commonjs2" : undefined,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: "node",
      compiler: "tsc",
      main: isProduction ? "./src/serverless.ts" : "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: "none",
      generatePackageJson: false,
    }),
  ],
};
