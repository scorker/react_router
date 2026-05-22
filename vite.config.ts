import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    exclude: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/system",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
});
