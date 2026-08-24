import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em desenvolvimento local (npm run dev), o proprio Vite faz proxy de /api para o backend,
// equivalente ao proxy feito pelo Nginx quando o frontend roda via Docker (ver nginx.conf).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
