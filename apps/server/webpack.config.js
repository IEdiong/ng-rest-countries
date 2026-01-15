const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { join } = require("path");
const fs = require("fs");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  output: {
    path: isProduction
      ? join(__dirname, "../../netlify/functions/server")
      : join(__dirname, "../../dist/apps/server"),
    filename: "server.js",
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
    // Fix package.json after build
    {
      apply: (compiler) => {
        if (isProduction) {
          compiler.hooks.afterEmit.tap("FixPackageJson", () => {
            const pkgPath = join(__dirname, "../../netlify/functions/server/package.json");
            if (fs.existsSync(pkgPath)) {
              const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
              pkg.main = "server.js";
              if (!pkg.dependencies.tslib) {
                pkg.dependencies.tslib = "^2.6.0";
              }
              fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
            }
          });
        }
      },
    },
  ],
};
