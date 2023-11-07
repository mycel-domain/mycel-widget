// vite.config.js
import { resolve } from "path";
import { defineConfig, UserConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  let config: UserConfig
  if (mode === "vercel") {
    config = defineConfig({
      build: {
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
      plugins: [nodePolyfills()]
    })
  }
  else {
    config = defineConfig({
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
  }
  return config

};
