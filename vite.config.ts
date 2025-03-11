/// <reference types="./types/vite-plugin-handlebars" />

import { resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  root: resolve(__dirname, "static"), // Root is the 'static' folder
  build: {
    outDir: "../dist", // Output directory
  },
  resolve: {
    alias: {
      "/src": resolve(__dirname, "src"),
    },
  },
  publicDir: resolve(__dirname, "public"),
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
    }),
  ],
});
