// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    build: {
      target: "es2020",
      lib: {
        entry: resolve(__dirname, "./src/index.ts"),
        name: "index",
        fileName: "index",
      },
      rollupOptions: {
        external: ["react"],
        output: {
          globals: {
            react: "React",
          },
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
        supported: { bigint: true },
        define: {
          global: "globalThis",
        },
      },
    },
    plugins: [nodePolyfills(), react()],
  });
};
