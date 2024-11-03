import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait()],
    server: {
        https: {
            key: fs.readFileSync('/mnt/c/Windows/System32/cert.key'),
            cert: fs.readFileSync('/mnt/c/Windows/System32/cert.crt'),
        },
        host: 'localhost',
        port: 5173, // or any preferred port
      },
});
