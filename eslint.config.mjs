import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Configuración específica para los tests de Jest
    files: ["src/tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
];