import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        // Fairshare/src is a junction to ../src; pin deps to this package's node_modules.
        alias: {
            react: path.resolve(rootDir, "node_modules/react"),
            "react-dom": path.resolve(rootDir, "node_modules/react-dom"),
            "react/jsx-runtime": path.resolve(rootDir, "node_modules/react/jsx-runtime.js"),
            "react/jsx-dev-runtime": path.resolve(rootDir, "node_modules/react/jsx-dev-runtime.js")
        }
    },
    server: {
        port: 3000,
        host: "127.0.0.1"
    }
});
