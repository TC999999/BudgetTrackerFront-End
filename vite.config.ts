import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@emotion/styled"],
  },
  test: { environment: "jsdom", globals: true, setUpFiles: "./tests/setup.ts" },
} as UserConfig);
