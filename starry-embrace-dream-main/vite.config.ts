import { defineConfig } from "vite";

// @lovable.dev/vite-tanstack-config arkada otomatik çalıştığı için 
// doğrudan standart Vite konfigürasyonunu dışa aktarıyoruz.
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
});