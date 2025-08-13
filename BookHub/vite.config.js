import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./src", // Serve files from src/
  build: {
    outDir: "../dist", // Output folder
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
