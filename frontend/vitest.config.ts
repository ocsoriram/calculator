// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
// import { playwright } from "@vitest/browser-playwright";

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

    // ブラウザの自動操作テスト用設定。
    // browser: {
    //   enabled: true,
    //   provider: playwright(),
    //   headless: true,
    //   instances: [
    //     { browser: "chromium" },
    //     { browser: "firefox" },
    //     { browser: "webkit" },
    //   ],
    // },
  },
});
