const nx = require("@nx/eslint-plugin");
const baseConfig = require("../../eslint.config.cjs");

module.exports = [
  ...baseConfig,
  ...nx.configs["flat/angular"],
  ...nx.configs["flat/angular-template"],
  {
    ignores: ["!**/*"],
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "rc",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "rc",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    // Override or add rules here
    rules: {},
  },
];
