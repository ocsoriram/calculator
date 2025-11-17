// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom", // ← 仮想DOM環境を有効化
    globals: true, // describe, it, expect を自動認識
    setupFiles: "./src/setupTests.ts", // ← 任意: jest-domの設定ファイル
  },
});
