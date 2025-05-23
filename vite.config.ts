import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["@emotion/styled"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setupTests.ts",
    css: true,
  },
} as UserConfig);
