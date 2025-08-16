const { ESLint } = require("eslint");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ["import"],
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src/shared/**/*",
            from: "./src/entities/**/*",
            message: "shared 레이어는 entities를 import할 수 없습니다.",
          },
          {
            target: "./src/shared/**/*",
            from: "./src/features/**/*",
            message: "shared 레이어는 features를 import할 수 없습니다.",
          },
          {
            target: "./src/shared/**/*",
            from: "./src/pages/**/*",
            message: "shared 레이어는 pages를 import할 수 없습니다.",
          },
          {
            target: "./src/shared/**/*",
            from: "./src/app/**/*",
            message: "shared 레이어는 app을 import할 수 없습니다.",
          },
          {
            target: "./src/entities/**/*",
            from: "./src/features/**/*",
            message: "entities 레이어는 features를 import할 수 없습니다.",
          },
          {
            target: "./src/entities/**/*",
            from: "./src/pages/**/*",
            message: "entities 레이어는 pages를 import할 수 없습니다.",
          },
          {
            target: "./src/entities/**/*",
            from: "./src/app/**/*",
            message: "entities 레이어는 app을 import할 수 없습니다.",
          },
          {
            target: "./src/features/**/*",
            from: "./src/pages/**/*",
            message: "features 레이어는 pages를 import할 수 없습니다.",
          },
          {
            target: "./src/features/**/*",
            from: "./src/app/**/*",
            message: "features 레이어는 app을 import할 수 없습니다.",
          },
          {
            target: "./src/pages/**/*",
            from: "./src/app/**/*",
            message: "pages 레이어는 app을 import할 수 없습니다.",
          },
          {
            target: "./src/entities/*/**/*",
            from: "./src/entities/*/**/*",
            except: ["./src/entities/*/index.ts", "./src/entities/index.ts"],
            message:
              "entities 간에는 Public API(index.ts)를 통해서만 import 가능합니다.",
          },
          {
            target: "./src/features/*/**/*",
            from: "./src/features/*/**/*",
            except: ["./src/features/*/index.ts", "./src/features/index.ts"],
            message:
              "features 간에는 Public API(index.ts)를 통해서만 import 가능합니다.",
          },
          {
            target: "./src/pages/*/**/*",
            from: "./src/pages/*/**/*",
            except: ["./src/pages/*/index.ts", "./src/pages/index.ts"],
            message:
              "pages 간에는 Public API(index.ts)를 통해서만 import 가능합니다.",
          },
        ],
      },
    ],
    "import/no-internal-modules": [
      "error",
      {
        allow: [
          "**/src/shared/**/*",
          "**/src/entities/*/index.ts",
          "**/src/features/*/index.ts",
          "**/src/pages/*/index.ts",
          "**/src/app/**/*",
          "~/**/*",
          "@/**/*",
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["src/app/**/*"],
      rules: {
        "import/no-internal-modules": "off",
      },
    },
    {
      files: ["*.config.*", "**/*.config.*"],
      rules: {
        "import/no-restricted-paths": "off",
        "import/no-internal-modules": "off",
      },
    },
  ],
};
