const nx = require("@nx/eslint-plugin");
const angular = require("angular-eslint");
const baseConfig = require("../../eslint.config.cjs");

module.exports = [
  ...baseConfig,
  ...nx.configs["flat/angular"],
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  ...angular.configs.templateRecommended.map((config) => ({
    ...config,
    files: ["**/*.html"],
  })),
  ...angular.configs.templateAccessibility.map((config) => ({
    ...config,
    files: ["**/*.html"],
  })),
];
