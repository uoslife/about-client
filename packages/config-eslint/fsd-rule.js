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
          "next/**/*",
          "react/**/*",
          "@toast-ui/**/*",
          "jotai/**/*",
          "motion/**/*",
          "@tanstack/**/*",
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
      files: ["src/shared/**/*"],
      rules: {
        "import/no-internal-modules": "off",
      },
    },
    {
      files: ["*.config.*", "**/*.config.*"],
      rules: {
        "import/no-internal-modules": "off",
      },
    },
  ],
};
