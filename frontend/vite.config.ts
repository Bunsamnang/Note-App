import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // This will open the app in your default browser
    // proxy: {
    //   "/api": "http://localhost:5000",
    // },
  },
});
