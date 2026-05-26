import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "jss-plugin-rule-value-function": resolve(
        currentDir,
        "utilities/jss-plugin-rule-value-function.ts",
      ),
      "jss-plugin-global": resolve(
        currentDir,
        "utilities/jss-plugin-global.ts",
      ),
      "jss-plugin-nested": resolve(
        currentDir,
        "utilities/jss-plugin-nested.ts",
      ),
      "jss-plugin-camel-case": resolve(
        currentDir,
        "utilities/jss-plugin-camel-case.ts",
      ),
      "jss-plugin-default-unit": resolve(
        currentDir,
        "utilities/jss-plugin-default-unit.ts",
      ),
      "jss-plugin-vendor-prefixer": resolve(
        currentDir,
        "utilities/jss-plugin-vendor-prefixer.ts",
      ),
      "jss-plugin-props-sort": resolve(
        currentDir,
        "utilities/jss-plugin-props-sort.ts",
      ),
    },
  },
  plugins: [reactRouter(), tailwindcss()],
  ssr: {
    // Workaround for resolving dependencies in the server bundle
    // Without this, the React context will be different between direct import and transitive imports in development environment
    // For more information, see https://github.com/mui/material-ui/issues/45878#issuecomment-2987441663
    optimizeDeps: {
      include: ["@emotion/*", "@mui/*"],
    },
    noExternal: ["@emotion/*", "@mui/*"],
  },
});
