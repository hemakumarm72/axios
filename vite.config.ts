import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/*": path.resolve(__dirname, "./src"),
      "@/atoms": path.resolve(__dirname, "./src/components/atoms"),
      "@/molecules": path.resolve(__dirname, "./src/components/molecules"),
      "@/organisms": path.resolve(__dirname, "./src/components/organisms"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/hooks": path.resolve(__dirname, "./src/hooks/"),
      "@/services": path.resolve(__dirname, "./src/services/"),
      "@/store": path.resolve(__dirname, "./src/store/"),
    },
  },
})
