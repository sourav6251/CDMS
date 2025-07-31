import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import fs from 'fs';
// https://vite.dev/config/
export default defineConfig({
    server: {
        host: "::",
        port: 3000,
        // https: {
        //     key: fs.readFileSync("localhost.key"),
        //     cert: fs.readFileSync("localhost.crt"),
        // },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
