import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/intercom": {
        target: "https://api.intercom.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/intercom/, ""),
        headers: {
          Authorization: `Bearer dG9rOjhlYmNlMDMzXzI1NDlfNDRlYl9iNmM5X2Q3NWRiNTJiMTNjODoxOjA=`,
          Accept: "application/json",
        },
      },
    },
  },
});
